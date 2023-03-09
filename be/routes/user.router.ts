import express from 'express';
import userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const userRouter = express.Router();

userRouter.route('/login').post(userController.login);
userRouter.route('/register').post(userController.register);
userRouter.route('/').get([authMiddleware], userController.getInfo);

userRouter.route('/edit').put(userController.edit);

export default userRouter;
