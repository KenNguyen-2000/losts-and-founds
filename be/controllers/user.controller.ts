import jwt from 'jsonwebtoken';
import { IUser } from './../models/user.model';
import { NextFunction, Request, Response, CookieOptions } from 'express';
import BaseError from '../errors/BaseError.error';
import userService from '../services/user.service';
import InternalServerError from '../errors/InternalServer.error';
import { IUpdateProfile } from '../interfaces/user.interface';

const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: false,
  maxAge: 3600000, // cookie expires in 1 hour
};

class UserController {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await userService.login({ email, password });

      const accessToken = jwt.sign(
        {
          _id: user._id,
          avatarUrl: user.avatarUrl,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: '1h',
        }
      );

      res
        .status(200)
        .json({ message: 'Login success', accessToken: accessToken });
    } catch (error) {
      return next(error);
    }
  }

  async loginGoogle(req: Request, res: Response, next: NextFunction) {
    const code = req.query.code as string;

    try {
      // get the id and access token with the code
      const { id_token, access_token } = await userService.getGoogleOAuthTokens(
        { code }
      );
      // console.log({ id_token, access_token });

      // get user with tokens
      const googleUser = await userService.getGoogleUser({
        id_token,
        access_token,
      });
      //jwt.decode(id_token);

      // console.log({ googleUser });

      if (!googleUser.verified_email) {
        return res.status(403).send('Google account is not verified');
      }

      // upsert the user
      const user = await userService.updateProfile(
        {
          email: googleUser.email,
        },
        {
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.picture,
        },
        {
          upsert: true,
          new: true,
        }
      );

      // create an access token
      const accessToken = jwt.sign(
        {
          _id: user?._id,
          email: user?.email,
          name: user?.name,
          avatarUrl: user?.avatarUrl,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' } // 15 minutes
      );
      res.cookie('accessToken', accessToken);
      res.redirect(process.env.CLIENT_ORIGIN_URL as string);
    } catch (error) {
      console.error(error, 'Failed to authorize Google user');
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const { email, password, phoneNumber, name, avatarUrl, dob }: IUser =
      req.body;
    try {
      const data = await userService.register({
        email,
        password,
        phoneNumber,
        name,
        avatarUrl,
        dob,
      });

      if (data) {
        res.status(200).json({
          accessToken: data.token,
        });
      } else {
        next(new InternalServerError('Something went wrong!!'));
      }
    } catch (error) {
      return next(error);
    }
  }

  async getInfo(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    try {
      const userInfo = await userService.getInfo(user?._id);

      if (userInfo) {
        res.status(200).json({
          user: userInfo,
          message: 'Get user info successfully!',
        });
      } else {
        next(new InternalServerError('Something went wrong!!'));
      }
    } catch (error) {
      return next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const { password, phoneNumber, name, avatarUrl, dob } = req.body;
    const { user, file } = req;
    let updateField: IUpdateProfile = { userId: user?._id };

    if (password) {
      updateField.password = password;
    }
    if (phoneNumber) {
      updateField.phoneNumber = phoneNumber;
    }
    if (name) {
      updateField.name = name;
    }
    if (avatarUrl) {
      updateField.avatarUrl = avatarUrl;
    }
    if (file) {
      updateField.avatarUrl = (file as Express.Multer.File).filename;
    }

    try {
      // const updatedUser = await userService.updateProfile(updateField);
      // if (updateField) {
      //   res.status(200).json({
      //     user: updatedUser,
      //     message: 'Update profile successfully!',
      //   });
      // } else {
      //   next(new InternalServerError('Something went wrong!!'));
      // }
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const { oldPassword, newPassword } = req.body;
    const { user } = req;
    try {
      const userInfo = await userService.changePassword({
        userId: user?._id,
        oldPassword,
        newPassword,
      });

      if (userInfo) {
        res.status(200).json({
          user: userInfo,
          message: 'Change password successfully!',
        });
      } else {
        next(new InternalServerError('Something went wrong!!'));
      }
    } catch (error) {
      return next(error);
    }
  }
}

const userController = new UserController();

export default userController;
