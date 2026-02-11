import { NextRequest, NextResponse } from "next/server";

// Toss Payments 결제 준비
export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, orderName, customerName, customerEmail } = await request.json();

    // 결제 정보 반환 (클라이언트에서 토스 SDK로 결제 진행)
    return NextResponse.json({
      success: true,
      clientKey: process.env.TOSS_CLIENT_KEY || process.env.TOSS_TEST_CLIENT_KEY,
      orderId,
      amount,
      orderName,
      customerName,
      customerEmail,
    });
  } catch (error) {
    console.error("Payment preparation error:", error);
    return NextResponse.json(
      { error: "결제 준비 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
