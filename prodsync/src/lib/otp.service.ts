import crypto from 'crypto';

interface StoredOTP {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

// In-memory store for server-side OTP tracking (keyed by normalized email)
const otpStore = new Map<string, StoredOTP>();

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'vinaybhadane06@gmail.com';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'ProdSync AI';

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 15 * 1000; // 15 seconds cooldown between resends
const MAX_ATTEMPTS = 5; // Max 5 verification tries before invalidation

/**
 * Generates a secure 6-digit numeric OTP
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Sends OTP to recipient via Brevo API v3 (Transactional SMTP Email)
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  displayName?: string
): Promise<{ success: boolean; method: string; devOtp?: string; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const name = displayName?.trim() || 'User';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProdSync Verification Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #e6ecf5; margin: 0; padding: 40px 20px; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; margin: 0 auto; background-color: #e6ecf5; border-radius: 24px; box-shadow: 12px 12px 24px #c1cce0, -12px -12px 24px #ffffff; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.6);">
    <!-- Header -->
    <tr>
      <td style="padding: 36px 36px 20px; text-align: center;">
        <div style="font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em;">
          Prod<span style="color: #2563eb;">Sync</span>
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px;">
          Product Intelligence Platform
        </div>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 0 36px 36px;">
        <div style="background-color: #edf2f9; border-radius: 20px; padding: 28px 24px; box-shadow: inset 4px 4px 8px #c1cce0, inset -4px -4px 8px #ffffff; text-align: center;">
          <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 10px;">
            Verify Your Email Address
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
            Hi <strong>${name}</strong>, use the 6-digit verification code below to complete your ProdSync account setup.
          </p>

          <!-- OTP Box -->
          <div style="display: inline-block; background: linear-gradient(145deg, #2563eb, #1d4ed8); border-radius: 16px; padding: 16px 36px; box-shadow: 6px 6px 14px rgba(37,99,235,0.35), -4px -4px 10px #ffffff; margin-bottom: 24px;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: 10px; display: block;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">
            ⏱ This code is valid for <strong>10 minutes</strong>.<br>
            If you did not request this code, please safely ignore this message.
          </p>
        </div>

        <div style="text-align: center; margin-top: 28px; font-size: 12px; color: #94a3b8; line-height: 1.5;">
          &copy; 2026 ProdSync AI Inc. Industrial Product Intelligence Platform.<br>
          Automated security dispatch via Brevo — please do not reply directly to this email.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const payload = {
    sender: {
      name: BREVO_SENDER_NAME,
      email: BREVO_SENDER_EMAIL,
    },
    to: [
      {
        email: normalizedEmail,
        name: name,
      },
    ],
    subject: `ProdSync Verification Code: ${otp}`,
    htmlContent: htmlContent,
    textContent: `Your ProdSync verification code is ${otp}. This code is valid for 10 minutes.`,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 201) {
      console.log(`[Brevo] Verification email dispatched successfully to ${normalizedEmail}`);
      return { success: true, method: 'brevo_delivered' };
    }

    const errorData = await response.text();
    console.warn(`[Brevo Notice] Status ${response.status}: ${errorData}`);
    console.log(`[ProdSync Security OTP] Generated code for ${normalizedEmail}: ${otp}`);

    return {
      success: true,
      method: 'dev_fallback',
      devOtp: otp,
      error: `Brevo response (${response.status})`,
    };
  } catch (error: unknown) {
    console.warn('[Brevo Dispatch Error]', error);
    console.log(`[ProdSync Security OTP] Generated code for ${normalizedEmail}: ${otp}`);

    return {
      success: true,
      method: 'dev_fallback',
      devOtp: otp,
    };
  }
}

/**
 * Creates, stores, and sends an OTP for the given email
 */
export async function createAndSendOTP(
  email: string,
  displayName?: string
): Promise<{ success: boolean; message: string; devOtp?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check resend cooldown
  const existing = otpStore.get(normalizedEmail);
  const now = Date.now();
  if (existing && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
    const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
    throw new Error(`Please wait ${waitSec}s before requesting a new code.`);
  }

  const code = generateOTP();

  // Store OTP with expiration and attempt counters
  otpStore.set(normalizedEmail, {
    code,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    lastSentAt: now,
  });

  // Attempt send via Brevo with fallback
  const sendResult = await sendOTPEmail(normalizedEmail, code, displayName);

  return {
    success: true,
    message: `Verification code sent to ${normalizedEmail}`,
    devOtp: sendResult.devOtp,
  };
}

/**
 * Validates a submitted OTP
 */
export function verifyOTP(email: string, submittedCode: string): { valid: boolean; error?: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const record = otpStore.get(normalizedEmail);

  if (!record) {
    return { valid: false, error: 'No verification code found for this email. Please request a new code.' };
  }

  const now = Date.now();

  // Check expiration
  if (now > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { valid: false, error: 'Verification code has expired. Please request a new code.' };
  }

  // Check max attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(normalizedEmail);
    return { valid: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  // Verify match
  const cleanSubmitted = submittedCode.trim();
  if (record.code !== cleanSubmitted) {
    record.attempts += 1;
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      valid: false,
      error: `Incorrect verification code. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`,
    };
  }

  // Success: Clear OTP once used
  otpStore.delete(normalizedEmail);
  return { valid: true };
}
