import mongoose, { Document, Types } from 'mongoose';

export interface IPost {
  title: string;
  description: string;
  location: string;
  images: string[];
  postType: 'lost' | 'found';
  createdBy: Types.ObjectId;
  comments: Types.ObjectId[];
  likes?: Types.ObjectId[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const postsSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    postType: {
      type: String,
      required: true,
      enum: ['lost', 'found'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'comments',
      default: [],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'users',
      default: [],
    },
    status: {
      type: String,
      enum: ['deleted', 'found', 'default'],
      default: 'default',
    },
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model('posts', postsSchema);

export default Posts;
