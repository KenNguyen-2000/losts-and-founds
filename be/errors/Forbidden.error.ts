import httpStatusCode from '../constants/http-status-codes.constant';
import BaseError from './BaseError.error';

export default class ForbiddenError extends BaseError {
  constructor(
    name: string,
    statusCode = httpStatusCode.FORBIDDEN,
    message = 'Forbidden'
  ) {
    super(message, statusCode, name);
  }
}
