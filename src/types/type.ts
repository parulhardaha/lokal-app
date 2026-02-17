export interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

export interface UserSession {
  email: string;
  startTime: number;
}
