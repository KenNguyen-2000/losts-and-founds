import { NextFunction, Request, Response } from 'express';
import BaseError from '../errors/BaseError.error';

const errorHandler = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);

  // render the error page
  res.status(err.statusCode || 500).json({
    error: {
      ...err,
      message: err.message,
    },
  });
};

export default errorHandler;
