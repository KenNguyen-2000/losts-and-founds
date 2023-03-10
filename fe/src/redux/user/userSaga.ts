import { AxiosResponse } from 'axios';
import { takeEvery, call, put } from 'redux-saga/effects';
import authService from '../../services/auth.service';
import { userActions } from './userSlice';

function* getUserInfo() {
  try {
    console.log('Get user info saga');
    const res: AxiosResponse = yield call(authService.getUserInfo);
    const { status, data } = res;
    if (status === 200) {
      yield put(userActions.getUserInfoSuccess(data.user));
    }
  } catch (error: any) {
    yield put(userActions.getUserInfoFailed(error.message));
  }
}

export function* userSaga() {
  yield takeEvery(userActions.getUserInfo.type, getUserInfo);
}
