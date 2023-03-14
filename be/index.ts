import express, { Express, NextFunction, Request, Response } from 'express';
const createError = require('http-errors');
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import userRouter from './routes/user.router';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.middleware';
import postRouter from './routes/post.router';
import path from 'path';
import commentRouter from './routes/comment.router';
import cookieParser from 'cookie-parser';

dotenv.config();

const URI: string = process.env.MONGO_URL!;
const PORT = process.env.PORT;

const app: Express = express();

mongoose.set('strictQuery', true);
const connection = mongoose.connect(URI);
connection
  .then((db) => {
    console.log('Mongoose is connected!');
  })
  .catch((err) => err);

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(
  '/api/v1/upload',
  express.static(path.join(__dirname, '..', 'uploads'))
);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
