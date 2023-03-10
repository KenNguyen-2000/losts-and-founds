import { authSaga } from './auth/auth.saga';
import { all } from 'redux-saga/effects';
import { postSaga } from './post/post.saga';
import { userSaga } from './user/userSaga';

export function* rootSaga() {
  yield all([authSaga(), postSaga(), userSaga()]);
}
