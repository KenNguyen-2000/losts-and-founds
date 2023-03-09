import mongoose, { Document, Types } from 'mongoose';

export interface IPost {
  title: string;
  description: string;
  location: string;
  images: string[];
  createdBy: Types.ObjectId;
  comments?: Types.ObjectId[];
  likes?: Types.ObjectId[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const postsSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      require: true,
    },
    images: {
      type: [String],
      require: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      require: true,
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
