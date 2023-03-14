import mongoose, { Document, Model, Types } from 'mongoose';

export interface IPost extends Document {
  description: string;
  location: string;
  images: string[];
  postType: 'lost' | 'found' | 'auction';
  createdBy: Types.ObjectId;
  comments: Types.ObjectId[];
  likes?: Types.ObjectId[];
  status: 'deleted' | 'found' | 'default';
}

const postsSchema = new mongoose.Schema<IPost>(
  {
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
      enum: ['lost', 'found', 'auction'],
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

// postsSchema.pre<IPost>('save', function (next) {
//   const now = new Date();
//   if (!this.createdAt) {
//     this.createdAt = now;
//   }
//   this.updatedAt = now;
//   next();
// });

postsSchema.pre('find', async function (next) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const sevenSecondsAgo = new Date(now.getTime() - 5 * 1000);
  const fourteenSecondsAgo = new Date(now.getTime() - 10 * 1000);
  try {
    await Posts.updateMany(
      {
        updatedAt: { $lte: sevenDaysAgo },
      },
      { $set: { postType: 'auction' } }
    ).exec();
    await Posts.updateMany(
      {
        updatedAt: { $lte: fourteenDaysAgo },
        status: 'default',
      },
      { $set: { status: 'deleted' } }
    ).exec();
    next();
  } catch (error: any) {
    next(error);
  }
});

const Posts: Model<IPost> = mongoose.model('posts', postsSchema);

export default Posts;
