import { Request, Response } from 'express';
import moment from 'moment';

import Loan from '../models/loanModel';
import { LoanTypes, Status } from '../interfaces/modelInterfaces';
import CustomErrorTemplate from '../errors/customeErrorTemplate';
import NotFoundError from '../errors/notFoundError';
import PersonlLoan from '../models/personalLoanModel';
import User from '../models/userModel';
import UnAuthorizedError from '../errors/unAuthorizedError';

export const createLoan = async (req: Request, res: Response) => {
  const { type } = req.body;
  const loans: LoanTypes[] = [LoanTypes.personalLoan];

  if (!loans.includes(type)) {
    throw new CustomErrorTemplate('Please select a valid loan type', 400);
  }
  const loan = Loan.build(req.body);
  await loan.save();
  res.status(201).json(loan);
};

export const getAllLoans = async (req: Request, res: Response) => {
  const loans = await Loan.find();
  res.status(200).json(loans);
};

export const getLoan = async (req: Request, res: Response) => {
  const id = req.params.id;
  const loan = await Loan.findById(id);
  // Check for loan
  // console.log('here');
  if (!loan) {
    throw new NotFoundError('loan not exist');
  }
  res.status(200).json(loan);
};

export const updateLoan = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { interestRate } = req.body;
  const loan = await Loan.findById(id);
  // Check for loan
  if (!loan) {
    throw new NotFoundError('loan not exist');
  }

  loan.interestRate = Number(interestRate);
  await loan.save();
  res.status(200).json(loan);
};

export const getAllPersonalLoans = async (req: Request, res: Response) => {
  const { status, createdAt, updatedAt } = req.query;

  // Create a Query Object
  let query: any = {};

  if (status) query.status = status;

  if (createdAt)
    query.createdAt = {
      $gte: moment(`${createdAt}`).toDate(),
      $lt: moment(`${createdAt}`).add(1, 'day').toDate(),
    };
  if (updatedAt)
    query.createdAt = {
      $gte: moment(`${updatedAt}`).toDate(),
      $lt: moment(`${updatedAt}`).add(1, 'day').toDate(),
    };

  const loans = await PersonlLoan.find({ ...query });
  res.status(200).json({ count: loans.length, loans });
};

export const getPersonalLoan = async (req: Request, res: Response) => {
  const id = req.params.id;
  const loan = await PersonlLoan.findOne({ loanId: id });
  // Check for loan
  // console.log('here');
  if (!loan) {
    throw new NotFoundError('loan not exist');
  }
  res.status(200).json(loan);
};

export const updatePersonalLoan = async (req: Request, res: Response) => {
  const id = req.params.id;
  const loan = await PersonlLoan.findOne({ loanId: id });
  // 1) Check for loan
  if (!loan) {
    throw new NotFoundError('loan not exist');
  }

  // 2) Check for user
  const user = await User.findById({ _id: loan.userId });
  if (!user) {
    throw new NotFoundError('user not exist');
  }

  // 3) Check Status of loan
  if (loan.loan.status === Status.approved) {
    throw new UnAuthorizedError('Loan already approved');
  }

  let oldState: any = {};
  Object.assign(oldState, loan.loan);

  loan.loan.principle = req.body.principle;

  const updatedLoan = { ...loan.loan };
  await loan.updateOne(
    {
      loan: updatedLoan,
      history: [...loan.history, oldState],
    },
    { new: true }
  );

  // update to user document
  const userLoans = user.loans?.map((userLoan) => {
    if (`${userLoan.id}` === `${loan.loanId}`) {
      userLoan = { ...loan.loan, ...req.body };
      return userLoan;
    }
    return userLoan;
  });

  await user.updateOne({ loans: userLoans }, { new: true });

  // action takes place
  res.status(200).json(loan);
};

export const authorizationLoan = async (req: Request, res: Response) => {
  const id = req.params.id;
  // 1) Find loan from personaloan Model
  const loan = await PersonlLoan.findOne({ loanId: id });
  if (!loan) {
    throw new NotFoundError('Loan not found');
  }

  // 2) Find user
  const user = await User.findById({ _id: loan.userId });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  let oldState: any = {};
  Object.assign(oldState, loan.loan);

  // Update on personal loan document
  loan.loan.status = req.body.action;

  await loan.updateOne(
    {
      loan: loan.loan,
      status: req.body.action,
      history: [...loan.history, oldState],
    },
    { new: true }
  );

  // update to user document
  const userLoans = user.loans?.map((userLoan) => {
    if (`${userLoan.id}` === `${loan.loanId}`) {
      userLoan.status = req.body.action;
      return userLoan;
    }
    return userLoan;
  });

  await user.updateOne({ loans: userLoans }, { new: true });

  res.send(loan);
};
