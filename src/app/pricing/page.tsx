"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestPayment: (method: string, options: {
        amount: number;
        orderId: string;
        orderName: string;
        customerName?: string;
        successUrl: string;
        failUrl: string;
      }) => Promise<void>;
    };
  }
}

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [clientKey, setClientKey] = useState("");
  
  const hasResult = searchParams.get("from") === "result";

  useEffect(() => {
    fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: `order_${Date.now()}`,
        amount: 4900,
        orderName: "자소서AI Pro 이용권",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientKey) {
          setClientKey(data.clientKey);
        }
      });
  }, []);

  const handlePayment = async (plan: "once" | "pro") => {
    if (!clientKey) {
      alert("결제 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setLoading(true);

    try {
      const amount = plan === "once" ? 1900 : 4900;
      const orderName = plan === "once" ? "자소서AI 1회 이용권" : "자소서AI Pro 월 구독";
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const tossPayments = window.TossPayments(clientKey);
      
      await tossPayments.requestPayment("카드", {
        amount,
        orderId,
        orderName,
        customerName: "고객",
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error: unknown) {
      const tossError = error as { code?: string };
      if (tossError.code !== "USER_CANCEL") {
        alert("결제 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v1/payment"
        strategy="afterInteractive"
      />
      
      <div className="min-h-screen flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {hasResult && (
              <div className="mb-8 p-4 bg-indigo-900/50 rounded-lg border border-indigo-700">
                <p className="text-indigo-300">
                  ✨ 자소서 미리보기가 생성되었습니다! 전체 내용을 확인하려면 결제해주세요.
                </p>
              </div>
            )}
            
            <h1 className="text-4xl font-bold mb-4">
              합격 자소서, <span className="text-indigo-500">지금 바로</span> 받아보세요
            </h1>
            <p className="text-gray-400 mb-12">
              AI가 작성한 맞춤형 자기소개서로 취업 성공률을 높이세요
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* 1회 이용권 */}
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-semibold mb-2">1회 이용권</h3>
                <p className="text-gray-400 text-sm mb-6">급하게 자소서 1개만 필요할 때</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₩1,900</span>
                  <span className="text-gray-400"> / 1회</span>
                </div>
                <ul className="text-left text-sm text-gray-300 space-y-2 mb-8">
                  <li>✓ 자소서 1회 생성</li>
                  <li>✓ 3개 섹션 (지원동기, 성장과정, 포부)</li>
                  <li>✓ 무제한 복사 & 다운로드</li>
                </ul>
                <button
                  onClick={() => handlePayment("once")}
                  disabled={loading || !clientKey}
                  className="w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "처리 중..." : "1회 이용권 구매"}
                </button>
              </div>

              {/* Pro 구독 */}
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 border border-indigo-500 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  인기
                </div>
                <h3 className="text-xl font-semibold mb-2">Pro 월 구독</h3>
                <p className="text-gray-300 text-sm mb-6">여러 회사에 지원하는 취준생 필수</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₩4,900</span>
                  <span className="text-gray-300"> / 월</span>
                </div>
                <ul className="text-left text-sm text-gray-200 space-y-2 mb-8">
                  <li>✓ <strong>무제한</strong> 자소서 생성</li>
                  <li>✓ 3개 섹션 (지원동기, 성장과정, 포부)</li>
                  <li>✓ 무제한 복사 & 다운로드</li>
                  <li>✓ 이력서 최적화 팁 (준비중)</li>
                </ul>
                <button
                  onClick={() => handlePayment("pro")}
                  disabled={loading || !clientKey}
                  className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "처리 중..." : "Pro 구독 시작하기"}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              결제 후 즉시 이용 가능 | 언제든 구독 취소 가능
            </p>

            <button
              onClick={() => router.back()}
              className="mt-6 text-gray-400 hover:text-white text-sm"
            >
              ← 돌아가기
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
