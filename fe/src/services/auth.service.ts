import { NewPasswordPayload, VerifyOtpPayload } from './../interfaces/auth';
import { AxiosResponse } from 'axios';
import { IUser } from '../interfaces/user';
import interceptor from './interceptor';

class AuthService {
  constructor() {}

  login = async (email: string, password: string): Promise<AxiosResponse> => {
    ('service');
    const res = await interceptor.post('/users/login', { email, password });
    return res;
  };

  getUserInfo = async (): Promise<AxiosResponse> => {
    ('Get user info service');
    const res = await interceptor.get('/users');
    return res;
  };

  sendOtp = async (email: string): Promise<AxiosResponse> => {
    const res = await interceptor.post('/users/forgot-password', {
      email: email,
    });
    return res;
  };

  verifyOtp = async ({
    otpId,
    otp,
    email,
  }: VerifyOtpPayload): Promise<AxiosResponse> => {
    const res = await interceptor.post('/users/verify-otp', {
      email: email,
      otpId: otpId,
      otp: otp,
    });
    return res;
  };

  changeNewPassword = async ({
    newPassword,
    email,
  }: NewPasswordPayload): Promise<AxiosResponse> => {
    console.log(email);
    const res = await interceptor.put('/users/new-password', {
      email: email,
      newPassword: newPassword,
    });
    return res;
  };
}

const authService = new AuthService();

export default authService;
