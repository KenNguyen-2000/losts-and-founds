export interface IComment {
  _id: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
    avatarUrl: string;
    email: string;
  };
}

export interface ICommentResponse extends IComment {
  postId: string;
}

export interface CommentPostPayload {
  postId: string;
  description: string;
}

export interface DeleteCommentPayload {
  commentId: string;
  postId: string;
}

export interface EditCommentPayload {
  postId: string;
  commentId: string;
  description: string;
}
