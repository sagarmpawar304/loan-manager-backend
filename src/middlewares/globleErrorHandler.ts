import { NextFunction, Request, Response } from 'express';
import CustomError from '../errors/customError';

const globleErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.seriliazeError());
  }
  console.log(err.message);
  res.send([{ message: 'something went wrong' }]);
  next();
};

export default globleErrorHandler;
