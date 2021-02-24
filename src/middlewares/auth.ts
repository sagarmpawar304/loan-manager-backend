import { Response, Request, NextFunction } from 'express';
import UnAuthorizedError from '../errors/unAuthorizedError';
import jwt from 'jsonwebtoken';
import User, { UserInfo } from '../models/userModel';
import NotFoundError from '../errors/notFoundError';

declare global {
  namespace Express {
    interface Request {
      user?: UserInfo;
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
    // console.log('unauthorized');
    throw new UnAuthorizedError();
  }

  // 1.a) Check token has expired
  const secretKey = process.env.JWTSECRET;
  const decode = jwt.verify(token!, secretKey!) as Decode;

  // 2) Decode token Data and find user
  const user = await User.findById(decode.id);

  if (!user) {
    throw new NotFoundError('user not found');
  }

  // 2.a) Check user updated account after token creation.
  const updatedDate = user.get('passwordUpdatedAt');
  const isUpdated =
    new Date(updatedDate).getTime() >
    new Date(decode.iat).getTime() * 1000 + 2000;

  if (isUpdated) {
    // console.log('auth issue');
    throw new UnAuthorizedError();
  }

  // 3) Add user data to request
  req.user = user;

  next();
};
