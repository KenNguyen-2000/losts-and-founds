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
}: ICreatePost): Promise<IPost> => {
  const newPost = await Posts.create({
    description,
    images,
    location,
    postType,
    createdBy,
  });

  if (!newPost) {
    throw new BadRequestError('Create post unsuccessfully!');
  }

  return newPost.populate('createdBy', 'name');
};

const getPostList = async (queryFields: QueryOpts): Promise<IPost[]> => {
  const { search, pageNo, pageSize, sortBy }: any = queryFields;
  const regex = new RegExp(search, 'i');
  const posts = await Posts.find({
    status: { $nin: 'deleted' },

    $or: [
      {
        location: {
          $regex: regex,
        },
      },
      {
        description: {
          $regex: regex,
        },
      },
    ],
  })
    .sort(sortBy)
    .populate('createdBy', 'name')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name',
      },
      options: {
        sort: {
          createdAt: 'desc',
        },
      },
    })
    .populate('likes', 'name')
    .skip(pageNo * pageSize)
    .limit(pageSize)
    .exec();

  return posts;
};

const getLostsPostList = async (queryFields: QueryOpts): Promise<IPost[]> => {
  const { search, pageNo, pageSize, sortBy }: any = queryFields;
  const regex = new RegExp(search, 'i');
  const posts = await Posts.find({
    status: { $nin: 'deleted' },
    postType: 'lost',
    $or: [
      {
        location: {
          $regex: regex,
        },
      },
      {
        description: {
          $regex: regex,
        },
      },
      {
        postType: {
          $in: regex,
        },
      },
    ],
  })
    .sort(sortBy)
    .populate('createdBy', 'name')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name',
      },
      options: {
        sort: {
          createdAt: 'desc',
        },
      },
    })
    .populate('likes', 'name')
    .skip(pageNo * pageSize)
    .limit(pageSize)
    .exec();

  return posts;
};

const getFoundsPostList = async (queryFields: QueryOpts): Promise<IPost[]> => {
  const { search, pageNo, pageSize, sortBy }: any = queryFields;
  const regex = new RegExp(search, 'i');
  const posts = await Posts.find({
    status: { $nin: 'deleted' },
    postType: 'found',
    $or: [
      {
        location: {
          $regex: regex,
        },
      },
      {
        description: {
          $regex: regex,
        },
      },
    ],
  })
    .sort(sortBy)
    .populate('createdBy', 'name')
    .populate({
      path: 'comments',
      model: 'comments',
      populate: {
        path: 'createdBy',
        model: 'users',
        select: 'name',
      },
      options: {
        sort: {
          createdAt: 'desc',
        },
      },
    })
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
    .populate('createdBy', 'name')
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

  return posts;
};

const getPost = async (postId: string): Promise<IPost> => {
  const post = await Posts.findOne({ _id: postId })
    .populate('createdBy', 'name')
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
  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }

  return { ...post.toObject() };
};

const deletePost = async (postId: string): Promise<void> => {
  const post = await Posts.findOneAndUpdate(
    { _id: postId },
    { status: 'deleted', comments: [] }
  )
    .populate('createdBy', 'name')
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
  ).exec();
  if (!updatedPost) {
    throw new NotFoundError('Post id not exists!');
  }

  return { ...updatedPost.toObject() };
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
    .populate('createdBy', 'name')
    .exec();

  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }

  return { ...post.toObject() };
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
    .populate('createdBy', 'name')
    .exec();
  if (!post) {
    throw new NotFoundError('Post id not exists!');
  }

  return { ...post.toObject() };
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
  getLostsPostList,
  getFoundsPostList,
};

export default postService;
