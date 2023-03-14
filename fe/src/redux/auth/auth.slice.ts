import { LoginPayload } from '../../interfaces/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { IUser } from '../../interfaces/user';
import Cookies from 'js-cookie';

interface AuthState {
  loading: boolean;
  isLoggedIn: boolean;
  userInfo: {};
  userToken?: string | null;
  error?: string | null;
  success: boolean;
}

const initialState: AuthState = {
  loading: false,
  isLoggedIn: Boolean(Cookies.get('accessToken')),
  userInfo: {},
  userToken: null,
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
  },
});

export const authActions = authSlice.actions;

export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUserInfo = (state: RootState) => state.auth.userInfo;
export const selectAuthErr = (state: RootState) => state.auth.error;

const authReducer = authSlice.reducer;
export default authReducer;
