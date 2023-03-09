import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../interfaces/post';
import { RootState } from '../store';

interface PostsState {
  posts: Post[];
  loading: boolean;
  error?: string | undefined;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getPostList(state, action) {
      state.loading = true;
    },
    getPostListSuccess(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
      state.loading = false;
    },
    getPostListFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const postActions = postSlice.actions;

const postRedcuer = postSlice.reducer;
export const selectPostsState = (state: RootState) => state.posts;

export default postRedcuer;
