import { NextFunction, Request, Response } from 'express';
import CustomError from '../errors/customError';
import { Error } from 'mongoose';

const globleErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.seriliazeError());
  }
  const name = err.name;
  // @ts-ignore
  const code = err.code;
  // @ts-ignore
  const field = err.keyValue;
  if (name === 'MongoError') {
    if (code === 11000) {
      res.status(400).json([{ message: 'duplicate value', field }]);
    }
  }

  console.log(err);

  res.send([{ message: 'something went wrong' }]);
  next();
};

export default globleErrorHandler;
