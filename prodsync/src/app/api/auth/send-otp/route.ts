import { NextRequest, NextResponse } from 'next/server';
import { createAndSendOTP } from '@/lib/otp.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, displayName } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const result = await createAndSendOTP(email, displayName);

    return NextResponse.json({
      success: true,
      message: result.message,
      devOtp: result.devOtp,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to dispatch verification email';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
