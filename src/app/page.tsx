"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    keywords: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      // Store result in sessionStorage and navigate
      sessionStorage.setItem("jasoseo_result", JSON.stringify(data));
      sessionStorage.setItem("jasoseo_input", JSON.stringify(formData));
      router.push("/result");
    } catch (error) {
      console.error(error);
      alert("생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI가 <span className="text-indigo-500">30초</span>만에
            <br />
            합격 자소서를 작성해드립니다
          </h1>
          <p className="text-lg text-gray-400 mb-12">
            회사명과 직무만 입력하면, AI가 맞춤형 자기소개서 초안을 무료로 생성합니다.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                회사명 *
              </label>
              <input
                type="text"
                required
                placeholder="예: 삼성전자, 네이버, 카카오"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                지원 직무 *
              </label>
              <input
                type="text"
                required
                placeholder="예: 프론트엔드 개발자, 마케팅, 기획"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                나를 표현하는 키워드 (선택)
              </label>
              <input
                type="text"
                placeholder="예: 협업, 문제해결, 성장, 열정"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  생성 중...
                </span>
              ) : (
                "무료로 자소서 생성하기 ✨"
              )}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            하루 1회 무료 | Pro 구독 시 무제한
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 px-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          © 2026 자소서AI. AI가 생성한 내용은 참고용이며, 최종 검토는 본인이 해주세요.
        </div>
      </footer>
    </div>
  );
}
