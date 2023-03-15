import mongoose, { Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  phoneNumber?: string;
  name: string;
  avatarUrl?: string;
  dob?: Date;
  isAdmin?: boolean;
  stripe_account_ID?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      min: 9,
      max: 15,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    name: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    stripe_account_ID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Users: Model<IUser> = mongoose.model('users', userSchema);

export default Users;
