import { LikePostPayload } from './../../interfaces/post';
import { CreatePostPayload, UpdatePostPayload } from './../../interfaces/post';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { put, takeEvery, takeLatest, call, delay } from 'redux-saga/effects';
import postService from '../../services/post.service';
import { postActions } from './postSlice';
import { CommentPostPayload } from '../../interfaces/comment';
import commentService from '../../services/comment.service';

function* getPostList() {
  try {
    console.log('saga');
    const res: AxiosResponse = yield call(postService.getPostList);
    const { status, data } = res;
    console.log(data);
    if (status === 200) {
      yield delay(1000);
      yield put(postActions.getPostListSuccess(data.posts));
    }
  } catch (error: any) {
    yield put(postActions.getPostListFailed(error.message)); // Dispatch action
  }
}

function* createPost(action: PayloadAction<CreatePostPayload>) {
  try {
    console.log('Create Post Saga');
    const res: AxiosResponse = yield call(
      postService.createPost,
      action.payload
    );
    const { status, data } = res;
    if (status === 201) {
      yield put(postActions.createPostSuccess(data.post));
    } else {
      yield put(postActions.createPostFailed('Something went wrong'));
    }
  } catch (error: any) {
    yield put(postActions.createPostFailed(error.message));
  }
}

function* deletePost(action: PayloadAction<string>) {
  const postId: string = action.payload;
  try {
    console.log('Delete Post Saga:');
    const res: AxiosResponse = yield call(postService.deletePost, postId);
    const { status } = res;
    if (status === 200) {
      yield put(postActions.deletePostSuccess(postId));
    } else {
      yield put(postActions.deletePostFailed('Something went wrong')); // Dispatch action
    }
  } catch (error: any) {
    yield put(postActions.deletePostFailed(error.message)); // Dispatch action
  }
}
function* getPost(action: PayloadAction<string>) {
  const postId: string = action.payload;
  try {
    console.log('Delete Post Saga:');
    const res: AxiosResponse = yield call(postService.getPost, postId);
    const { status, data } = res;
    if (status === 200) {
      yield put(postActions.getPostSuccess(data));
    } else {
      yield put(postActions.getPostFailed('Something went wrong')); // Dispatch action
    }
  } catch (error: any) {
    yield put(postActions.getPostFailed(error.message)); // Dispatch action
  }
}

function* updatePost(action: PayloadAction<UpdatePostPayload>) {
  try {
    console.log('Update Post Saga:');
    const res: AxiosResponse = yield call(
      postService.updatePost,
      action.payload
    );
    const { status, data } = res;
    if (status === 200) {
      yield put(postActions.updatePostSuccess(data.post));
    } else {
      yield put(postActions.updatePostFailed('Something went wrong')); // Dispatch action
    }
  } catch (error: any) {
    yield put(postActions.updatePostFailed(error.message)); // Dispatch action
  }
}

function* commentPost(action: PayloadAction<CommentPostPayload>) {
  try {
    console.log('Comment Post Saga:');
    const res: AxiosResponse = yield call(
      commentService.commentPost,
      action.payload
    );
    const { status, data } = res;
    if (status === 201) {
      console.log(data);
      yield put(
        postActions.commentPostSuccess({
          postId: action.payload.postId,
          ...data.comment,
        })
      );
    } else {
      yield put(postActions.commentPostFailed('Something went wrong')); // Dispatch action
    }
  } catch (error: any) {
    yield put(postActions.commentPostFailed(error.message)); // Dispatch action
  }
}

function* likePost(action: PayloadAction<LikePostPayload>) {
  try {
    console.log('Update Post Saga:');
    const res: AxiosResponse = yield call(postService.likePost, action.payload);
    const { status, data } = res;
    if (status === 200) {
      console.log(data.post);
      yield put(postActions.likePostSuccess(data.post));
    } else {
      yield put(postActions.likePostFailed('Something went wrong')); // Dispatch action
    }
  } catch (error: any) {
    yield put(postActions.updatePostFailed(error.message)); // Dispatch action
  }
}

export function* postSaga() {
  yield takeLatest(postActions.createPost.type, createPost);
  yield takeLatest(postActions.getPostList.type, getPostList);
  yield takeLatest(postActions.getPost.type, getPost);
  yield takeEvery(postActions.deletePost.type, deletePost);
  yield takeLatest(postActions.updatePost.type, updatePost);
  yield takeLatest(postActions.likePost.type, likePost);
  yield takeLatest(postActions.commentPost.type, commentPost);
}
