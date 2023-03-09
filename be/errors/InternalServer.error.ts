import httpStatusCode from '../constants/http-status-codes.constant';
import BaseError from './BaseError.error';

export default class InternalServerError extends BaseError {
  constructor(
    name: string,
    statusCode = httpStatusCode.INTERNAL_SERVER,
    message = 'Internal Server'
  ) {
    super(message, statusCode, name);
  }
}
