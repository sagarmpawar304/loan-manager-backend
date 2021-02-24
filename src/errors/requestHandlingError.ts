import { ValidationError } from 'express-validator';

import CustomError from './customError';

class RequestHandlingError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Error in requested data');

    Object.setPrototypeOf(this, RequestHandlingError.prototype);
  }

  seriliazeError = () => {
    return this.errors.map((err) => {
      return { message: err.msg };
    });
  };
}

export default RequestHandlingError;
