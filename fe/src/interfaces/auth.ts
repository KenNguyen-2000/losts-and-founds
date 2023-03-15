export interface LoginPayload {
  email: string;
  password: string;
}

export interface OtpRes {
  otpId: string;
  email: string;
}

export interface VerifyOtpPayload {
  otpId: string;
  otp: string;
  email: string;
}

export interface NewPasswordPayload {
  newPassword: string;
  email: string;
}
