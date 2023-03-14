import BadRequestError from '../errors/BadRequest.error';
import InternalServerError from '../errors/InternalServer.error';
import NotFoundError from '../errors/NotFound.error';
import {
  ICreateComment,
  IDeleteComment,
  IEditComment,
} from '../interfaces/dto/comment.dto';
import Comments from '../models/comments.model';
import Posts from '../models/post.model';

const createComment = async ({
  postId,
  description,
  userId,
}: ICreateComment): Promise<any> => {
  const newComment = await Comments.create({
    description: description,
    createdBy: userId,
  });

  if (!newComment) {
    throw new InternalServerError('Comment failed!');
  }

  const existingPost = await Posts.findOneAndUpdate(
    {
      _id: postId,
      status: {
        $nin: 'deleted',
      },
    },
    {
      $push: {
        comments: newComment._id,
      },
    }
  ).exec();

  if (!existingPost) {
    await Comments.findOneAndDelete({ _id: newComment._id });
    throw new InternalServerError('Update post failed!');
  }

  await newComment.populate('createdBy', 'name email avatarUrl');

  return newComment;
};

const editComment = async ({ commentId, description }: IEditComment) => {
  const isCommentExist = await Comments.findOneAndUpdate(
    {
      _id: commentId,
    },
    {
      description: description,
    }
  )
    .populate('createdBy', 'name email avatarUrl')
    .exec();

  if (!isCommentExist) {
    throw new NotFoundError('Comment not found!');
  }

  return isCommentExist;
};

const deleteComment = async ({ commentId, postId }: IDeleteComment) => {
  const isCommentExist = await Comments.findOneAndDelete({
    _id: commentId,
  })
    .populate('createdBy', 'name email avatarUrl')
    .exec();

  if (!isCommentExist) {
    throw new NotFoundError('Comment not found!');
  }

  Posts.findOneAndUpdate(
    { _id: postId },
    {
      comments: {
        $pull: commentId,
      },
    }
  );

  return isCommentExist;
};

const commentService = { createComment, editComment, deleteComment };

export default commentService;
