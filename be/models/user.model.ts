import mongoose from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  phoneNumber?: string;
  name: string;
  avatarUrl?: string;
  dob?: Date;
  isAdmin?: boolean;
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
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model<IUser>('users', userSchema);

export default Users;
