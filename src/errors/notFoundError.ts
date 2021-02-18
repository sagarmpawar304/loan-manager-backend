import CustomError from './customError';

class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(message = 'Not found') {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  seriliazeError = () => {
    return [{ message: this.message }];
  };
}

export default NotFoundError;
