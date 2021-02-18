import CustomError from './customError';

class UnAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(message = 'Not Authorized') {
    super(message);

    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  seriliazeError = () => {
    return [{ message: this.message }];
  };
}

export default UnAuthorizedError;
