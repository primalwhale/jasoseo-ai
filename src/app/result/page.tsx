"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ResultData {
  motivation: string;
  growth: string;
  vision: string;
}

interface InputData {
  company: string;
  position: string;
  keywords: string;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-sm px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
    >
      {copied ? "✓ 복사됨" : `${label} 복사`}
    </button>
  );
}

function Section({
  title,
  content,
  copyLabel,
}: {
  title: string;
  content: string;
  copyLabel: string;
}) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <CopyButton text={content} label={copyLabel} />
      </div>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [input, setInput] = useState<InputData | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("jasoseo_result");
    const storedInput = sessionStorage.getItem("jasoseo_input");

    if (storedResult && storedInput) {
      const parsed = JSON.parse(storedResult);
      setResult(parsed.data);
      setInput(JSON.parse(storedInput));
    } else {
      router.push("/");
    }
  }, [router]);

  if (!result || !input) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const fullText = `[지원동기]\n${result.motivation}\n\n[성장과정]\n${result.growth}\n\n[입사 후 포부]\n${result.vision}`;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>{input.company}</span>
            <span>·</span>
            <span>{input.position}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            AI가 작성한 자기소개서 초안입니다 ✨
          </h1>
          <p className="text-gray-400">
            각 섹션을 복사하여 사용하세요. 본인의 경험에 맞게 수정하면 더 좋은 자소서가 됩니다.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 mb-8">
          <Section
            title="1. 지원동기"
            content={result.motivation}
            copyLabel="지원동기"
          />
          <Section
            title="2. 성장과정"
            content={result.growth}
            copyLabel="성장과정"
          />
          <Section
            title="3. 입사 후 포부"
            content={result.vision}
            copyLabel="포부"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <CopyButton text={fullText} label="전체" />
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-3 px-6 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            새로 작성하기
          </button>
        </div>

        {/* Pro CTA */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50">
          <h3 className="text-lg font-semibold text-white mb-2">
            Pro로 업그레이드 🚀
          </h3>
          <p className="text-gray-300 mb-4">
            무제한 생성 + AI 첨삭 피드백 + 맞춤법 검사
          </p>
          <button className="py-2 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">
            ₩9,900/월 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
