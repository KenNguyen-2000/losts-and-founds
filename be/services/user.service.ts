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
import Otp from '../models/otp.model';
const stripe = require('stripe')(
  'sk_test_51MlohlKIBca3SmNV3O8ppOcB1ZVei3CRdeUh0Xdpzwv6gvaPinumgq5KKmrcDKCydPyCjFZKJSRL9XrfAiYhRQfB00fN4oHelR'
);
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
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: newUser.email,
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
    business_type: 'individual',
    business_profile: {
      url: 'http://www.facebook.com',
      mcc: '7299',
      name: 'Example, Inc.',
      support_email: newUser.email,
      support_url: 'https://www.facebook.com',
    },
  });
  newUser.stripe_account_ID = account.id;
  await newUser.save();

  const token = jwt.sign(
    {
      _id: newUser._id,
      avatarUrl: newUser.avatarUrl,
      name: newUser.name,
      email: newUser.email,
      stripe_account_ID: newUser.stripe_account_ID,
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
    {
      name: 1,
      avatarUrl: 1,
      dob: 1,
      phoneNumber: 1,
      email: 1,
      stripe_account_ID: 1,
    }
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
  email,
  oldPassword,
  newPassword,
}: IChangePassword) => {
  const user = await Users.findOne({ email: email }).exec();

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

const createVerificationOtp = async (email: string, otp: string) => {
  const existingUser = await Users.findOne({ email: email }).exec();
  console.log(email, otp);
  if (!existingUser) {
    throw new NotFoundError('Cannot found registed email!');
  }

  const hashedOtp = await bcrypt.hash(otp, 10);

  const newOtp = await Otp.create({
    otp: hashedOtp,
    userId: existingUser._id,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000,
  });

  return newOtp;
};

const verifyOtp = async (otpId: string, otp: string) => {
  const existingOtp = await Otp.findOne({
    _id: otpId,
  });

  if (!existingOtp) {
    throw new NotFoundError('Otp id not found');
  }

  if (Date.now() > existingOtp.expiresAt.getTime()) {
    throw new BadRequestError('Otp expired!');
  }

  const isCorrect = await bcrypt.compare(otp, existingOtp.otp as string);

  if (!isCorrect) {
    throw new BadRequestError('Wrong otp code!');
  }

  return existingOtp;
};

const newPassword = async (newPassword: string, email: string) => {
  const existingUser = await Users.findOne({
    email: email,
  });

  if (!existingUser) {
    throw new NotFoundError('Email not found');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  existingUser.password = hashedPassword;
  await existingUser.save();

  return existingUser;
};

const userService = {
  login,
  register,
  getInfo,
  changePassword,
  updateProfile,
  getGoogleOAuthTokens,
  getGoogleUser,
  createVerificationOtp,
  verifyOtp,
  newPassword,
};

export default userService;
