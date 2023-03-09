import { Request } from 'express';
import { IUser } from '../../models/user.model';

export interface RequestWithUser<T> extends Request {
  user: IUser;
  body: T;
}
