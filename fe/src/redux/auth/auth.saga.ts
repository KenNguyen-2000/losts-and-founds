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
import { LoginPayload } from '../../interfaces/auth';
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
    yield put(authActions.loginFailed(error.data.error.message)); // Dispatch action
  }
}

function* handleLogout() {
  yield delay(500);
  Cookies.remove('accessToken');
}

export function* authSaga() {
  yield takeLatest(authActions.login.type, handleLogin);
  yield takeLatest(authActions.logout.type, handleLogout);
}
