import { IUser } from './../models/user.model';
import { NextFunction, Request, Response } from 'express';
import BaseError from '../errors/BaseError.error';
import userService from '../services/user.service';
import InternalServerError from '../errors/InternalServer.error';
import { IUpdateProfile } from '../interfaces/user.interface';

class UserController {
  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    try {
      const user = await userService.login({ username, password });

      if (user) {
        res.status(200).json({
          accessToken: user.accessToken,
        });
      } else {
        next(new InternalServerError('Something went wrong!!'));
      }
    } catch (error) {
      return next(error);
    }
  }
  async register(req: Request, res: Response, next: NextFunction) {
    const { username, password, phoneNumber, name, avatarUrl, dob }: IUser =
      req.body;
    try {
      const data = await userService.register({
        username,
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
      const updatedUser = await userService.updateProfile(updateField);

      if (updateField) {
        res.status(200).json({
          user: updatedUser,
          message: 'Update profile successfully!',
        });
      } else {
        next(new InternalServerError('Something went wrong!!'));
      }
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
