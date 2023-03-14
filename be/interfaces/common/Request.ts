import { Request } from 'express';
import { IUser } from '../../models/user.model';

export interface RequestWithUser<T> extends Request {
  user: IUser;
  body: T;
}

export interface QueryOpts {
  search: string;
  pageNo: number;
  pageSize: number;
  filter: Record<string, unknown>;
  sortBy: Record<string, number>[];
}

export interface RequestQueryOpts {
  search?: string;
  pageNo?: string;
  pageSize?: string;
  postType?: string;
  sortBy?: string | string[];
}
