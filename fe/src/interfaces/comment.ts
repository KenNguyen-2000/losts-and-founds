export interface IComment {
  _id: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

export interface ICommentResponse extends IComment {
  postId: string;
}

export interface CommentPostPayload {
  postId: string;
  description: string;
}
