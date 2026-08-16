import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit verification code are required' },
        { status: 400 }
      );
    }

    const verification = verifyOTP(email, otp);

    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Invalid verification code' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Email verified successfully',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
