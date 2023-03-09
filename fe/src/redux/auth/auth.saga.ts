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

function* handleLogin(payload: LoginPayload) {
  try {
    console.log('saga');
    const res: AxiosResponse = yield call(
      authService.login,
      payload.username,
      payload.password
    );
    const { status, data } = res;
    console.log(data);
    if (status === 200) {
      localStorage.setItem('access_token', data.accessToken);
      yield put(authActions.loginSuccess(data));
    }
  } catch (error: any) {
    yield put(authActions.loginFailed(error.message)); // Dispatch action
  }
}

function* handleLogout() {
  yield delay(500);
  console.log('logout saga');
  localStorage.removeItem('access_token');
}

function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(localStorage.getItem('access_token'));
    console.log('Watch auth');
    if (!isLoggedIn) {
      const action: PayloadAction<LoginPayload> = yield take(
        authActions.login.type
      );
      yield fork(handleLogin, action.payload); // Non-blocking
    }

    yield take(authActions.logout.type);
    yield call(handleLogout); // Blocking - wait for the logout function to finish before continuing to watch watchLoginFlow
  }
}

export function* authSaga() {
  yield fork(watchLoginFlow);
}
