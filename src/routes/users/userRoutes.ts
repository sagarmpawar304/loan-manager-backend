import { getAllUser, updateUser, updateUsers } from './../../controllers/user';
import express from 'express';
import { body } from 'express-validator';
import { createLoan, getUser, signIn, signUp } from '../../controllers/user';
import { Role } from '../../interfaces/modelInterfaces';
import allowAccess from '../../middlewares/allowAccess';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/api/user/signup',
  [
    body('name').notEmpty().withMessage('Please provide your name'),
    body('email').isEmail().withMessage('Please Provide valid Email'),
    body('password')
      .trim()
      .isLength({ min: 5, max: 16 })
      .withMessage('Password length must be between 5 and 16'),
  ],
  validateRequest,
  signUp
);

router.post(
  '/api/user/signin',
  [
    body('email').isEmail().withMessage('Please Provide valid Email'),
    body('password')
      .trim()
      .isLength({ min: 5, max: 16 })
      .withMessage('Password length must be between 5 and 16'),
  ],
  validateRequest,
  signIn
);

router.get(
  '/api/user/:id',
  auth,
  allowAccess([Role.agent, Role.admin, Role.customer]),
  getUser
);

router.get(
  '/api/users',
  auth,
  allowAccess([Role.agent, Role.admin]),
  getAllUser
);

router.put(
  '/api/user',
  auth,
  allowAccess([Role.customer]),
  [
    body('name').notEmpty().withMessage('Please provide your name'),
    body('password')
      .trim()
      .isLength({ min: 5, max: 16 })
      .withMessage('Password length must be between 5 and 16'),
  ],
  validateRequest,
  updateUser
);

router.put(
  '/api/user/auth/:id',
  auth,
  allowAccess([Role.agent, Role.admin]),
  updateUsers
);

router.post(
  '/api/user/loan',
  auth,
  allowAccess([Role.agent, Role.customer]),
  [
    body('loanId').isMongoId().withMessage('Provide a valid loan'),
    body('principle').isNumeric().withMessage('Please provide priciple amount'),
    body('duration_in_months')
      .isNumeric()
      .withMessage('Please provide month duration'),
  ],
  validateRequest,
  createLoan
);

export { router as userRouter };
