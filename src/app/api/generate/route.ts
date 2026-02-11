import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { company, position, keywords } = await request.json();

    if (!company || !position) {
      return NextResponse.json(
        { error: "회사명과 직무는 필수입니다." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `당신은 한국 기업 채용 담당자 관점을 이해하는 자기소개서 작성 전문가입니다.

다음 규칙을 반드시 따르세요:
1. 한국어로 작성하며, 비즈니스 문체를 사용합니다.
2. 구체적이고 진정성 있는 표현을 사용합니다.
3. 각 섹션은 300-400자 내외로 작성합니다.
4. 지원 회사와 직무에 맞춤화된 내용을 작성합니다.
5. 실제 합격 자소서처럼 설득력 있게 작성합니다.

다음 정보를 바탕으로 자기소개서를 작성해주세요:

회사명: ${company}
지원 직무: ${position}
${keywords ? `키워드: ${keywords}` : ""}

다음 3가지 항목을 JSON 형식으로 반환해주세요:
1. motivation (지원동기): 왜 이 회사, 이 직무에 지원하는지
2. growth (성장과정): 관련 경험과 역량을 보여주는 이야기
3. vision (입사 후 포부): 입사 후 어떻게 기여할 것인지

반드시 아래 JSON 형식만 반환하세요 (다른 텍스트 없이):
{
  "motivation": "지원동기 내용...",
  "growth": "성장과정 내용...",
  "vision": "입사 후 포부 내용..."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 파싱 (마크다운 코드블록 제거)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI 응답에서 JSON을 찾을 수 없습니다.");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      data: {
        motivation: parsed.motivation,
        growth: parsed.growth,
        vision: parsed.vision,
      },
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "자소서 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
