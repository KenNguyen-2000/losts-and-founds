import { authSaga } from './auth/auth.saga';
import { all } from 'redux-saga/effects';

export function* rootSaga() {
  yield all([authSaga()]);
}
