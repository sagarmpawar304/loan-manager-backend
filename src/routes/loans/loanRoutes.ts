import {
  getAllLoans,
  getLoan,
  updateLoan,
  getAllPersonalLoans,
  authorizationLoan,
  getPersonalLoan,
  updatePersonalLoan,
} from './../../controllers/loans';
import { createLoan } from '../../controllers/loans';
import express from 'express';
import { body } from 'express-validator';
import { Role } from '../../interfaces/modelInterfaces';
import allowAccess from '../../middlewares/allowAccess';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/api/loan/create',
  auth,
  allowAccess([Role.admin]),
  [
    body('name').notEmpty().withMessage('Please provide a name'),
    body('interestRate').notEmpty().withMessage('Please provide interest rate'),
    body('type').notEmpty().withMessage('Please provide its type'),
  ],
  validateRequest,
  createLoan
);

router.get(
  '/api/loan/personalloan',
  auth,
  allowAccess([Role.admin, Role.agent]),
  getAllPersonalLoans
);

router
  .route('/api/loan/personalloan/:id')
  .get(auth, allowAccess([Role.admin, Role.agent]), getPersonalLoan)
  .put(auth, allowAccess([Role.agent]), updatePersonalLoan);

router.post(
  '/api/loan/admin/personalloan/:id',
  auth,
  allowAccess([Role.admin]),
  authorizationLoan
);

router.get('/api/loans', getAllLoans);
router.get('/api/loan/:id', getLoan);
router.put(
  '/api/loan/:id',
  auth,
  allowAccess([Role.admin]),
  [
    body('interestRate')
      .isNumeric()
      .withMessage('Please provide interest rate'),
  ],
  validateRequest,
  updateLoan
);

export { router as loanRouter };
