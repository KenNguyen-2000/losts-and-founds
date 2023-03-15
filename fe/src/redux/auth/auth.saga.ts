import { AxiosResponse } from 'axios';
import { IUser } from './../../../../be/models/user.model';
import { PayloadAction } from '@reduxjs/toolkit';
import authService from '../../services/auth.service';
import {
  call,
  put,
  take,
  fork,
  delay,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import {
  LoginPayload,
  NewPasswordPayload,
  VerifyOtpPayload,
} from '../../interfaces/auth';
import { authActions } from './auth.slice';
import Cookies from 'js-cookie';

function* handleLogin(action: PayloadAction<LoginPayload>) {
  try {
    const res: AxiosResponse = yield call(
      authService.login,
      action.payload.email,
      action.payload.password
    );
    const { status, data } = res;
    if (status >= 200 && status < 300) {
      Cookies.set('accessToken', data.accessToken);
      yield put(authActions.loginSuccess(data));
    }
  } catch (error: any) {
    yield put(authActions.loginFailed(error));
  }
}

function* handleLogout() {
  yield delay(500);
  Cookies.remove('accessToken');
}

function* handleSendOtp(action: PayloadAction<string>) {
  try {
    const res: AxiosResponse = yield call(authService.sendOtp, action.payload);
    const { status, data } = res;
    yield put(authActions.sendOtpSuccess(data));
  } catch (error: any) {
    console.log(error);
    yield put(authActions.sendOtpFailed(error.data.error.message));
  }
}

function* handleVerifyOtp(action: PayloadAction<VerifyOtpPayload>) {
  try {
    const res: AxiosResponse = yield call(
      authService.verifyOtp,
      action.payload
    );
    const { status, data } = res;
    if (status >= 200 && status < 300) {
      window.location.assign(`/change-password?email=${data.email}`);
      yield put(authActions.sendOtpSuccess(data));
    }
  } catch (error: any) {
    console.log(error);
    yield put(authActions.sendOtpFailed(error.data.error.message));
  }
}

function* handleChangeNewPassword(action: PayloadAction<NewPasswordPayload>) {
  try {
    const res: AxiosResponse = yield call(
      authService.changeNewPassword,
      action.payload
    );
    const { status, data } = res;
    if (status >= 200 && status < 300) {
      window.location.assign('/login');
      yield put(authActions.sendOtpSuccess(data));
    }
  } catch (error: any) {
    console.log(error);
    yield put(authActions.sendOtpFailed(error.data.error.message));
  }
}

export function* authSaga() {
  yield takeLatest(authActions.login.type, handleLogin);
  yield takeLatest(authActions.logout.type, handleLogout);
  yield takeLatest(authActions.sendOtp.type, handleSendOtp);
  yield takeLatest(authActions.verifyOtp.type, handleVerifyOtp);
  yield takeLatest(authActions.changeNewPassword.type, handleChangeNewPassword);
}
