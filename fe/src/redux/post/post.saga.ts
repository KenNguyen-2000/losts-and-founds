import { AxiosResponse } from 'axios';
import { put, takeEvery, takeLatest, call } from 'redux-saga/effects';
import postService from '../../services/post.service';
import { postActions } from './postSlice';
function* getPostList() {
  try {
    console.log('saga');
    const res: AxiosResponse = yield call(postService.getPostList);
    const { status, data } = res;
    console.log(status);
    if (status === 200) {
      localStorage.setItem('access_token', data.accessToken);
      yield put(postActions.getPostListSuccess(data));
    }
  } catch (error: any) {
    yield put(postActions.getPostListFailed(error.message)); // Dispatch action
  }
}

export function* postSaga() {
  yield takeLatest(postActions.getPostList, getPostList);
}
