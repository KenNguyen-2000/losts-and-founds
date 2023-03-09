import httpStatusCode from '../constants/http-status-codes.constant';
import BaseError from './BaseError.error';

export default class NotFoundError extends BaseError {
  constructor(
    name: string,
    message = 'Not found',
    statusCode = httpStatusCode.NOT_FOUND
  ) {
    super(message, statusCode, name);
  }
}
