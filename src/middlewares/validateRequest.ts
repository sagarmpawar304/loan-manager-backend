import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import RequestHandlingError from '../errors/requestHandlingError';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestHandlingError(errors.array());
  }
  next();
};
