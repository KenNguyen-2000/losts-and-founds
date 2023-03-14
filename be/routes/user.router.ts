import express from 'express';
import userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  uploadFileMiddleware,
  uploadFilesMiddleware,
} from '../middleware/upload-img.middleware';

const userRouter = express.Router();

userRouter.route('/login').post(userController.login);
userRouter.route('/login/google').get(userController.loginGoogle);
userRouter.route('/register').post(userController.register);
userRouter.route('/').get([authMiddleware], userController.getInfo);
userRouter
  .route('/change-password')
  .put([authMiddleware], userController.changePassword);

userRouter
  .route('/update-profile')
  .put([authMiddleware, uploadFileMiddleware], userController.updateProfile);

export default userRouter;
