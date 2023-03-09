import httpStatusCode from '../constants/http-status-codes.constant';
import BaseError from './BaseError.error';

export default class UnauthorizedError extends BaseError {
  constructor(
    name: string,
    message = 'Unauthorized',
    statusCode = httpStatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode, name);
  }
}
