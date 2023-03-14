import {
  GoogleTokensResult,
  GoogleUserResult,
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
import qs from 'qs';
import { QueryOptions, UpdateQuery, _FilterQuery } from 'mongoose';
import axios from 'axios';
import InternalServerError from '../errors/InternalServer.error';
import { CookieOptions } from 'express';
dotenv.config();

const login = async ({ email, password }: ILogin) => {
  const isExisted = await Users.findOne({ email: email }).exec();
  if (!isExisted) {
    throw new NotFoundError("Email doesn't exist");
  }

  const isCorrectPwd = await bcrypt.compare(password, isExisted.password);
  if (isCorrectPwd) {
    return isExisted;
  } else {
    throw new BadRequestError('Wrong password!');
  }
};

const register = async ({
  email,
  password,
  phoneNumber,
  name,
  avatarUrl,
  dob,
}: IUser) => {
  const isExisted = await Users.findOne({ email: email }).exec();
  if (isExisted) {
    throw new BadRequestError('Email already existed');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await Users.create({
    email: email,
    password: hashedPassword,
    phoneNumber: phoneNumber,
    name: name,
    avatarUrl: avatarUrl,
    dob: dob,
  });

  const token = jwt.sign(
    {
      _id: newUser._id,
      avatarUrl: newUser.avatarUrl,
      name: newUser.name,
      email: newUser.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1h',
    }
  );

  return {
    newUser,
    token,
  };
};

const getInfo = async (userId: string) => {
  userId;
  const user = await Users.findOne(
    { _id: userId },
    { name: 1, avatarUrl: 1, dob: 1, phoneNumber: 1, email: 1 }
  ).exec();

  if (!user) {
    throw new NotFoundError('User not found!');
  }

  return user;
};

const updateProfile = async (
  query: _FilterQuery<IUser>,
  update: UpdateQuery<IUser>,
  options: QueryOptions = {}
) => {
  return Users.findOneAndUpdate(query, update, options);
};

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

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLEC_CLIENT_SECRET_ID,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT,
    grant_type: 'authorization_code',
  };

  try {
    const res = await axios.post<GoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error(error.response.data.error);
    console.error(error, 'Failed to fetch Google Oauth Tokens');
    throw new Error(error.message);
  }
}

export async function getGoogleUser({
  id_token,
  access_token,
}: any): Promise<GoogleUserResult> {
  try {
    const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
    const res = await axios.get<GoogleUserResult>(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error(error, 'Error fetching Google user');
    throw new Error(error.message);
  }
}

const userService = {
  login,
  register,
  getInfo,
  changePassword,
  updateProfile,
  getGoogleOAuthTokens,
  getGoogleUser,
};

export default userService;
