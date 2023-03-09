import mongoose, { Types } from 'mongoose';

export interface IComment {
  description: string;
  createdBy: Types.ObjectId;
}

const commentsSchema = new mongoose.Schema<IComment>(
  {
    description: {
      type: String,
      require: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      require,
    },
  },
  {
    timestamps: true,
  }
);

const Comments = mongoose.model('comments', commentsSchema);

export default Comments;
