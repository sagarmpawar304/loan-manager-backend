import { Role } from './../interfaces/modelInterfaces';
import { Request, Response, NextFunction } from 'express';
import UnAuthorizedError from '../errors/unAuthorizedError';

const allowAccess = (role: Role[]) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!role.includes(user?.role!)) {
    throw new UnAuthorizedError();
  }
  next();
};

export default allowAccess;
