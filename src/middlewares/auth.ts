import { Response, Request, NextFunction } from 'express';
import UnAuthorizedError from '../errors/unAuthorizedError';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import NotFoundError from '../errors/notFoundError';

const secretKey = process.env.JWTSECRET;

if (!secretKey) {
  throw new Error('Please provide jwt secret key');
}

declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

interface Decode {
  id: string;
  email: string;
  iat: string;
  exp: string;
}
/**
 *
 * @type Midddleware
 * @description check input credentials provided by user with system data
 * and response with that.
 */

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  // 1) Check for bearer token
  if (!token) {
    throw new UnAuthorizedError();
  }

  // 1.a) Check token has expired
  const decode = jwt.verify(token, secretKey) as Decode;

  const isTokenExpired = new Date(decode.exp).getTime() < Date.now();

  if (isTokenExpired) {
    throw new UnAuthorizedError();
  }

  // 2) Decode token Data and find user
  const user = await User.findById(decode.id);

  if (!user) {
    throw new NotFoundError();
  }

  // 2.a) Check user updated account after token creation.
  const updatedDate = user.get('updatedAt');
  const isUpdated =
    new Date(updatedDate).getTime() > new Date(decode.iat).getTime();

  if (isUpdated) {
    throw new UnAuthorizedError();
  }

  // 3) Add user data to request
  req.user = user.id;
  next();
};
