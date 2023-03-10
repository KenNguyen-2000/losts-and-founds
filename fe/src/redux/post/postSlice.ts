import { CommentPostPayload, ICommentResponse } from '../../interfaces/comment';
import {
  CreatePostPayload,
  LikePostPayload,
  LikePostRes,
  UpdatePostPayload,
} from './../../interfaces/post';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPost } from '../../interfaces/post';
import { RootState } from '../store';

interface PostsState {
  posts: IPost[];
  selectedPost?: IPost;
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
    createPost(state, action: PayloadAction<CreatePostPayload>) {
      state.loading = true;
    },

    createPostSuccess(state, action: PayloadAction<IPost>) {
      console.log('Post slice finish');
      state.posts.push(action.payload);
      state.loading = false;
    },

    createPostFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    getPostList(state) {
      state.loading = true;
    },

    getPostListSuccess(state, action: PayloadAction<IPost[]>) {
      state.posts = action.payload;
      state.loading = false;
    },

    getPostListFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    getPost(state, action: PayloadAction<string>) {
      state.loading = true;
    },

    getPostSuccess(state, action: PayloadAction<IPost>) {
      state.selectedPost = action.payload;
      state.loading = false;
    },

    getPostFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    updatePost(state, action: PayloadAction<UpdatePostPayload>) {
      state.loading = true;
    },

    updatePostSuccess(state, action: PayloadAction<IPost>) {
      state.posts = state.posts.map((post: IPost) => {
        if (post._id === action.payload._id) {
          return action.payload;
        } else {
          return post;
        }
      });
      state.loading = false;
    },

    updatePostFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    deletePost(state, action: PayloadAction<string>) {
      state.loading = true;
    },
    deletePostSuccess(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
      state.loading = false;
    },
    deletePostFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    likePost(state, action: PayloadAction<LikePostPayload>) {
      state.loading = true;
    },

    likePostSuccess(state, action: PayloadAction<LikePostRes>) {
      state.posts = state.posts.map((post: IPost) => {
        if (post._id === action.payload._id) {
          return action.payload;
        } else {
          return post;
        }
      });
      state.loading = false;
    },
    likePostFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    commentPost(state, action: PayloadAction<CommentPostPayload>) {
      // state.loading = true;
    },

    commentPostSuccess(state, action: PayloadAction<ICommentResponse>) {
      console.log(action.payload);
      state.posts = state.posts.map((post: IPost) => {
        if (post._id === action.payload.postId) {
          post.comments.push({
            _id: action.payload._id,
            description: action.payload.description,
            createdBy: action.payload.createdBy,
          });
          return post;
        } else {
          return post;
        }
      });
      // state.loading = false;
    },
    commentPostFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      // state.loading = false;
    },
  },
});

export const postActions = postSlice.actions;

const postReducer = postSlice.reducer;
export const selectPostsState = (state: RootState) => state.posts;
export const selectPosts = (state: RootState) => state.posts.posts;
export const selectPostsLoading = (state: RootState) => state.posts.loading;

export default postReducer;
