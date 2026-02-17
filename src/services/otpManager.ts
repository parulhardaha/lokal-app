import { OtpRecord } from '../types/type';

const otpStore = new Map<string, OtpRecord>();

const OTP_EXPIRY_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 3;

export const generateOtp = (email: string): string => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const otpRecord: OtpRecord = {
    code,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  };

  otpStore.set(email, otpRecord);

  return code;
};

export const validateOtp = (
  email: string,
  input: string
): { success: boolean; message: string } => {
  const record = otpStore.get(email);

  if (!record) {
    return { success: false, message: 'No OTP found' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return { success: false, message: 'Expired. Please resend the OTP' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return { success: false, message: 'Maximum attempts exceeded' };
  }

  if (record.code !== input) {
    record.attempts += 1;
    otpStore.set(email, record);
    return { success: false, message: 'Incorrect OTP' };
  }

  otpStore.delete(email);
  return { success: true, message: 'OTP verified' };
};
