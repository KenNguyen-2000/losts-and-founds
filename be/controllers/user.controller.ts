import { IUser } from './../models/user.model';
import { NextFunction, Request, Response } from 'express';
import BaseError from '../errors/BaseError.error';
import userService from '../services/user.service';
import InternalServerError from '../errors/InternalServer.error';

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

  async edit(req: Request, res: Response, next: NextFunction) {}
}

const userController = new UserController();

export default userController;
