import { LoginPayload } from '../../interfaces/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { IUser } from '../../interfaces/user';

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
  isLoggedIn: Boolean(localStorage.getItem('access_token')),
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
      state.loading = false;

      state.error = action.payload;
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

const authReducer = authSlice.reducer;
export default authReducer;
