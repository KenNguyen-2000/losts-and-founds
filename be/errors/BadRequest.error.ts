import httpStatusCode from '../constants/http-status-codes.constant';
import BaseError from './BaseError.error';
export default class BadRequestError extends BaseError {
  constructor(
    name: string,
    message = 'Bad Request',
    statusCode = httpStatusCode.BAD_REQUEST
  ) {
    super(message, statusCode, name);
  }
}
