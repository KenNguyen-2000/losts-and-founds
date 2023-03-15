import { NewPasswordPayload, VerifyOtpPayload } from './../../interfaces/auth';
import { LoginPayload, OtpRes } from '../../interfaces/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { IUser } from '../../interfaces/user';
import Cookies from 'js-cookie';

interface AuthState {
  loading: boolean;
  isLoggedIn: boolean;
  userInfo: {};
  otp: {
    otpId?: string;
    email?: string;
  };
  error?: string | null;
  success: boolean;
}

const initialState: AuthState = {
  loading: false,
  isLoggedIn: Boolean(Cookies.get('accessToken')),
  userInfo: {},
  otp: {},
  error: null,
  success: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      state.loading = true;
    },
    loginSuccess(state, action: PayloadAction<IUser>) {
      state.loading = false;
      state.isLoggedIn = true;
      state.userInfo = action.payload;
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoggedIn = false;
      state.loading = false;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userInfo = {};
    },
    sendOtp(state, action: PayloadAction<string>) {
      state.loading = true;
      state.success = false;
    },
    sendOtpSuccess(state, action: PayloadAction<OtpRes>) {
      state.success = true;
      state.loading = false;
    },
    sendOtpFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
      state.success = false;
    },
    verifyOtp(state, action: PayloadAction<VerifyOtpPayload>) {
      state.loading = true;
      state.success = false;
    },
    verifyOtpSuccess(state, action: PayloadAction<OtpRes>) {
      state.otp.email = action.payload.email;
      state.success = true;
      state.loading = false;
    },
    verifyOtpFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.success = false;
      state.loading = false;
    },

    changeNewPassword(state, action: PayloadAction<NewPasswordPayload>) {
      state.loading = true;
      state.success = false;
    },
    changeNewPasswordSuccess(state, action: PayloadAction<OtpRes>) {
      state.success = true;
      state.loading = false;
    },
    changeNewPasswordFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.success = false;
      state.loading = false;
    },
  },
});

export const authActions = authSlice.actions;

export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUserInfo = (state: RootState) => state.auth.userInfo;
export const selectAuthErr = (state: RootState) => state.auth.error;
export const selectAuthSuccess = (state: RootState) => state.auth.success;
export const selectOtp = (state: RootState) => state.auth.otp;

const authReducer = authSlice.reducer;
export default authReducer;
