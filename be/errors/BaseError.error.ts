import httpStatusCode from '../constants/http-status-codes.constant';

export default class BaseError extends Error {
  statusCode: number;

  constructor(name: string, statusCode: number, message = 'Internal Server') {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
