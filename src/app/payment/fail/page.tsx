"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">😢</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">결제 취소</h1>
        <p className="text-gray-400 mb-2">
          {message || "결제가 취소되었습니다."}
        </p>
        {code && (
          <p className="text-sm text-gray-500 mb-8">
            오류 코드: {code}
          </p>
        )}
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium"
          >
            다시 시도하기
          </Link>
          <Link
            href="/"
            className="block py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}
