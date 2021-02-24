import CustomError from './customError';

class CustomErrorTemplate extends CustomError {
  statusCode = this.status;

  constructor(message: string, public status: number) {
    super(message);

    Object.setPrototypeOf(this, CustomErrorTemplate.prototype);
  }

  seriliazeError = () => {
    return [{ message: this.message }];
  };
}

export default CustomErrorTemplate;
