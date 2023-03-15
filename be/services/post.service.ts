import { QueryOpts } from './../interfaces/common/Request';
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

const createPost = async ({
  description,
  images,
  createdBy,
  postType,
  location,
  itemName,
}: ICreatePost): Promise<IPost> => {
  const newPost = await Posts.create({
    description,
    images,
    location,
    postType,
    createdBy,
    itemName,
  });

  if (!newPost) {
    throw new BadRequestError('Create post unsuccessfully!');
  }

  return newPost.populate('createdBy', 'name email avatarUrl');
};

const getPostList = async ({
  search,
  sortBy,
  pageNo,
  pageSize,
  filter,
}: QueryOpts): Promise<IPost[]> => {
  const sort: any = Object.fromEntries(sortBy as any);
  console.log(sort);
  const posts = await Posts.find({
    $or: [
      { location: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ],
    status: 'default',
    ...filter,
  })
    .populate('createdBy', 'name email avatarUrl')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name email avatarUrl',
      },
    })
    .sort(sort)
    .populate('likes', 'name')
    .skip(pageNo * pageSize)
    .limit(pageSize)
    .exec();

  return posts;
};

const getCreatedPostList = async (userId: string): Promise<IPost[]> => {
  const posts = await Posts.find({
    status: { $nin: 'deleted' },
    createdBy: userId,
  })
    .populate('createdBy', 'name email avatarUrl')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name email avatarUrl',
      },
    })
    .exec();

  return posts;
};

const getPost = async (postId: string): Promise<IPost> => {
  console.log('PostId', postId);
  const post = await Posts.findOne({ _id: postId })
    .populate('createdBy', 'name email avatarUrl stripe_account_ID')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name email avatarUrl',
      },
    })
    .exec();
  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }

  return post;
};

const deletePost = async (postId: string): Promise<void> => {
  const post = await Posts.findOneAndUpdate(
    { _id: postId },
    { status: 'deleted', comments: [] }
  )
    .populate('likes', 'name')
    .populate('createdBy', 'name email avatarUrl')
    .exec();

  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }

  if (post.comments.length > 0) {
    await Comments.deleteMany({
      _id: {
        $in: post.comments,
      },
    });
  }
};

const updatePost = async (updatedFields: IUpdatePost): Promise<IPost> => {
  const updatedPost = await Posts.findOneAndUpdate(
    { _id: updatedFields._id },
    {
      $set: updatedFields,
    },
    { new: true }
  )
    .populate('likes', 'name')
    .populate('createdBy', 'name email avatarUrl')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name email avatarUrl',
      },
    })
    .exec();
  if (!updatedPost) {
    throw new NotFoundError('Post id not exists!');
  }

  return updatedPost;
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
  )
    .populate('likes', 'name')
    .populate('createdBy', 'name email avatarUrl')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name email avatarUrl',
      },
    })
    .exec();

  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }

  return post;
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
  )
    .populate('createdBy', 'name email avatarUrl')
    .populate('likes', 'name')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name email avatarUrl',
      },
    })
    .exec();
  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }

  return post;
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
    .populate('createdBy', 'name email avatarUrl')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name',
      },
    })
    .exec();
  if (!updatedPost) {
    throw new InternalServerError('Save post unsuccessfully!');
  }
  return updatedPost;
};

interface IRaisePrice {
  postId: string;
  priceStep: string;
  raisedUser: string;
  minPrice: string;
}

const raisePrice = async ({
  postId,
  priceStep,
  raisedUser,
  minPrice,
}: IRaisePrice): Promise<IPost> => {
  const updatedPost = await Posts.findOneAndUpdate(
    { _id: postId },
    {
      minPrice: minPrice + priceStep,
      raisedUser: raisedUser,
    },
    { new: true }
  )
    .populate('likes', 'name')
    .populate('createdBy', 'name email avatarUrl')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name email avatarUrl',
      },
    })

    .exec();
  if (!updatedPost) {
    throw new NotFoundError('Post id not exists!');
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
  raisePrice,
};

export default postService;
