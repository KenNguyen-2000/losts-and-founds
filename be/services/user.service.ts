import {
  IChangePassword,
  ILogin,
  IUpdateProfile,
} from '../interfaces/user.interface';
import Users, { IUser } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import NotFoundError from '../errors/NotFound.error';
import BadRequestError from '../errors/BadRequest.error';
dotenv.config();

const login = async ({ username, password }: ILogin) => {
  const isExisted = await Users.findOne({ username: username }).exec();
  if (!isExisted) {
    throw new NotFoundError("Email doesn't exist");
  }

  const isCorrectPwd = await bcrypt.compare(password, isExisted.password);
  if (isCorrectPwd) {
    const token = jwt.sign({ id: isExisted._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return {
      user: isExisted,
      accessToken: token,
    };
  } else {
    throw new BadRequestError('Wrong password!');
  }
};

const register = async ({
  username,
  password,
  phoneNumber,
  name,
  avatarUrl,
  dob,
}: IUser) => {
  const isExisted = await Users.findOne({ username: username }).exec();
  if (isExisted) {
    throw new BadRequestError('Username already existed');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await Users.create({
    username: username,
    password: hashedPassword,
    phoneNumber: phoneNumber,
    name: name,
    avatarUrl: avatarUrl,
    dob: dob,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  return {
    newUser,
    token,
  };
};

const getInfo = async (userId: string) => {
  console.log(userId);
  const user = await Users.findOne(
    { _id: userId },
    { name: 1, avatarUrl: 1, dob: 1, phoneNumber: 1, username: 1 }
  ).exec();

  if (!user) {
    throw new NotFoundError('User not found!');
  }

  return user;
};

const updateProfile = async (updateField: IUpdateProfile) => {};

const changePassword = async ({
  userId,
  oldPassword,
  newPassword,
}: IChangePassword) => {
  const user = await Users.findOne({ _id: userId }).exec();

  if (!user) {
    throw new NotFoundError('User not found!');
  }

  const isMatched = await bcrypt.compare(oldPassword, user.password);

  if (!isMatched) {
    throw new BadRequestError('Old password does not match!');
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return user;
};

const userService = { login, register, getInfo, changePassword, updateProfile };

export default userService;
