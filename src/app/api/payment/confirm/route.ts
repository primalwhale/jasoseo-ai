import { NextRequest, NextResponse } from "next/server";

// Toss Payments 결제 승인
export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    const secretKey = process.env.TOSS_SECRET_KEY || process.env.TOSS_TEST_SECRET_KEY;
    const encryptedSecretKey = Buffer.from(secretKey + ":").toString("base64");

    // 토스 결제 승인 API 호출
    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "결제 승인 실패" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: data,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      { error: "결제 승인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
