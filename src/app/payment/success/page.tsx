"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setStatus("error");
        setMessage("결제 정보가 올바르지 않습니다.");
        return;
      }

      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus("success");
          // 결제 완료 상태 저장
          sessionStorage.setItem("payment_completed", "true");
        } else {
          setStatus("error");
          setMessage(data.error || "결제 승인에 실패했습니다.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("결제 처리 중 오류가 발생했습니다.");
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">결제 확인 중...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">결제 실패</h1>
          <p className="text-gray-400 mb-8">{message}</p>
          <Link
            href="/pricing"
            className="inline-block py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium"
          >
            다시 시도하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">결제 완료!</h1>
        <p className="text-gray-400 mb-8">
          이제 자소서AI를 마음껏 이용하세요.
        </p>
        <Link
          href="/"
          className="inline-block py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium"
        >
          자소서 생성하러 가기 →
        </Link>
      </div>
    </div>
  );
}
