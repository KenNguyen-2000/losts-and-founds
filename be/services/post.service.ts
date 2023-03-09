import Posts, { IPost } from './../models/post.model';
import {
  ICommentPost,
  ICreatePost,
  IUpdatePost,
} from '../interfaces/dto/post.dto';
import Comments, { IComment } from '../models/comments.model';
import {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} from '../errors/error';

const getPostList = async (): Promise<IPost[]> => {
  const posts = await Posts.find({ status: { $nin: 'deleted' } }).exec();

  return posts;
};

const getCreatedPostList = async (userId: string): Promise<IPost[]> => {
  const posts = await Posts.find({
    status: { $nin: 'deleted' },
    createdBy: userId,
  }).exec();

  return posts;
};

const createPost = async ({
  title,
  description,
  images,
  createdBy,
  location,
}: ICreatePost): Promise<IPost> => {
  const newPost = await Posts.create({
    title,
    description,
    images,
    createdBy,
    location,
  });

  if (!newPost) {
    throw new BadRequestError('Create post unsuccessfully!');
  }
  console.log(newPost);

  return newPost;
};

const getPost = async (postId: string): Promise<IPost> => {
  const post = await Posts.findOne({ _id: postId }).exec();
  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }

  return { ...post };
};

const deletePost = async (postId: string): Promise<void> => {
  const post = await Posts.findOneAndUpdate(
    { _id: postId },
    { status: 'deleted' }
  ).exec();
  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }
};

const updatePost = async (
  postId: string,
  {
    title,
    description,
    comments,
    createdBy,
    images,
    likes,
    location,
    status,
  }: IUpdatePost
): Promise<IPost> => {
  const updatedPost = await Posts.findOneAndUpdate(
    { _id: postId },
    {
      title: title,
      description: description,
      comments: comments,
      createdBy: createdBy,
      images: images,
      likes: likes,
      location: location,
      status,
    },
    { new: true }
  ).exec();
  if (!updatedPost) {
    throw new NotFoundError('Post id not exists!');
  }

  return { ...updatedPost };
};

const likePost = async (postId: string, userId: string): Promise<IPost> => {
  const post = await Posts.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $push: {
        likes: userId,
      },
    },
    { new: true }
  ).exec();
  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }

  return { ...post };
};

const dislikePost = async (postId: string, userId: string): Promise<IPost> => {
  const post = await Posts.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $pull: {
        likes: userId,
      },
    },
    { new: true }
  ).exec();
  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }

  return { ...post };
};

const commentPost = async ({
  postId,
  description,
  createdBy,
}: ICommentPost): Promise<IPost> => {
  const newComment = await Comments.create({
    description: description,
    createdBy: createdBy,
  });
  if (!newComment) {
    throw new InternalServerError('Comment unsuccessfully!');
  }

  const updatedPost = await Posts.findOneAndUpdate(
    { _id: postId },
    {
      $push: {
        comments: newComment._id,
      },
    },
    { new: true }
  )
    .populate('comments')
    .exec();
  if (!updatedPost) {
    throw new InternalServerError('Save post unsuccessfully!');
  }
  return updatedPost;
};

const postService = {
  getPostList,
  getCreatedPostList,
  createPost,
  getPost,
  deletePost,
  updatePost,
  likePost,
  dislikePost,
  commentPost,
};

export default postService;
