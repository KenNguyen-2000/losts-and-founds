import {
  CommentPostPayload,
  DeleteCommentPayload,
  EditCommentPayload,
  ICommentResponse,
} from '../../interfaces/comment';
import {
  CreatePostPayload,
  GetPostRes,
  IPagingOpts,
  LikePostPayload,
  LikePostRes,
  RaisePricePayload,
  UpdatePostPayload,
} from './../../interfaces/post';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPost } from '../../interfaces/post';
import { RootState } from '../store';

interface PostsState {
  posts: IPost[];
  selectedPost?: IPost;
  loading: boolean;
  getPostLoading: boolean;
  error?: string | undefined;
  pageNo: number;
  hasMore: boolean;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  hasMore: true,
  getPostLoading: false,
  pageNo: 0,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    createPost(state, action: PayloadAction<CreatePostPayload>) {
      state.loading = true;
    },
    createPostSuccess(state, action: PayloadAction<IPost>) {
      state.posts.push(action.payload);
      state.loading = false;
    },
    createPostFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    getPostList(state, action: PayloadAction<IPagingOpts>) {
      console.log('Get list');
      state.loading = true;
      state.getPostLoading = true;
    },
    getPostListSuccess(state, action: PayloadAction<GetPostRes>) {
      state.posts = action.payload.posts;
      state.hasMore = action.payload.hasMore;
      state.pageNo = state.pageNo + 1;
      state.loading = false;
      state.getPostLoading = false;
    },
    getPostListFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
      state.getPostLoading = false;
    },

    getMorePosts(state, action: PayloadAction<IPagingOpts>) {
      console.log('Get More');
      state.getPostLoading = true;
    },
    getMorePostsSuccess(state, action: PayloadAction<GetPostRes>) {
      state.posts = state.posts.concat(action.payload.posts);
      state.hasMore = action.payload.hasMore;
      state.pageNo = state.pageNo + 1;
      state.getPostLoading = false;
    },
    getMorePostsFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.getPostLoading = false;
    },

    getPostsBySearch(state, action: PayloadAction<string>) {
      state.loading = true;
      state.getPostLoading = true;
      // return state;
    },
    getPostsBySearchSuccess(state, action: PayloadAction<GetPostRes>) {
      state.posts = action.payload.posts;
      state.hasMore = action.payload.hasMore;
      state.loading = false;
      state.getPostLoading = false;
    },
    getPostsBySearchFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
      state.getPostLoading = false;
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

    raisePrice(state, action: PayloadAction<RaisePricePayload>) {
      // state.loading = true;
    },
    raisePriceSuccess(state, action: PayloadAction<IPost>) {
      state.posts = state.posts.map((post: IPost) => {
        if (post._id === action.payload._id) {
          return action.payload;
        } else {
          return post;
        }
      });
      // state.loading = false;
    },
    raisePriceFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      // state.loading = false;
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
      // state.loading = true;
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

    editCommentPost(state, action: PayloadAction<EditCommentPayload>) {
      // state.loading = true;
    },
    editCommentPostSuccess(state, action: PayloadAction<ICommentResponse>) {
      state.posts = state.posts.map((post: IPost) => {
        if (post._id === action.payload.postId) {
          post.comments = post.comments.map((comment) => {
            if (comment._id === action.payload._id) {
              return {
                _id: action.payload._id,
                description: action.payload.description,
                createdBy: action.payload.createdBy,
              };
            }
            return comment;
          });
          return post;
        } else {
          return post;
        }
      });
      // state.loading = false;
    },
    editCommentPostFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      // state.loading = false;
    },

    deleteCommentPost(state, action: PayloadAction<DeleteCommentPayload>) {
      // state.loading = true;
    },
    deleteCommentPostSuccess(state, action: PayloadAction<ICommentResponse>) {
      state.posts = state.posts.map((post: IPost) => {
        if (post._id === action.payload.postId) {
          post.comments = post.comments.filter(
            (comment) => comment._id !== action.payload._id
          );
          return post;
        } else {
          return post;
        }
      });
      // state.loading = false;
    },
    deleteCommentPostFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      // state.loading = false;
    },

    reloadPosts(state) {
      state.posts = [];
    },
  },
});

export const postActions = postSlice.actions;

const postReducer = postSlice.reducer;
export const selectPostsState = (state: RootState) => state.posts;
export const selectPosts = (state: RootState) => state.posts.posts;
export const selectPostsLoading = (state: RootState) =>
  state.posts.getPostLoading;

export const selectLoading = (state: RootState) => state.posts.loading;
export const selectPostsHasMore = (state: RootState) => state.posts.hasMore;
export const selectPostsPageNo = (state: RootState) => state.posts.pageNo;
export const selectPostsError = (state: RootState) => state.posts.error;

export default postReducer;
