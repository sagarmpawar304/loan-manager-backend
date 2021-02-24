import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import moment from 'moment';

import User from '../models/userModel';
import NotFoundError from '../errors/notFoundError';
import CustomErrorTemplate from '../errors/customeErrorTemplate';
import Loan from '../models/loanModel';
import { ILoan, Status } from './../interfaces/modelInterfaces';
import PersonlLoan from '../models/personalLoanModel';
import { UserDoc } from './../models/userModel';

const generateToken = (user: UserDoc) => {
  const jwtSecretKey = process.env.JWTSECRET;
  const token = jwt.sign({ id: user.id!, email: user.email }, jwtSecretKey!, {
    expiresIn: '7d',
  });

  return token;
};
export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1) Check email already exist
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('user not found');
  }

  // 2) Validate password
  const isPasswordsMatched = bcrypt.compareSync(password, user.password);
  if (!isPasswordsMatched) {
    throw new CustomErrorTemplate('Please provide a valid credentials', 400);
  }

  // 3) Generate a token
  const token = generateToken(user);

  // 3) Send a response
  res.status(200).json({ user, token });
};

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  // 1) Match current password with password
  if (password !== confirmPassword) {
    throw new CustomErrorTemplate('Password must match', 400);
  }

  // 2) Check email already exist
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new CustomErrorTemplate('Email already in use', 400);
  }

  // 3) Save user to database
  const user = User.build({
    name,
    email,
    password,
  });
  await user.save();

  // 4) Generate a token

  const token = generateToken(user);

  // 5) Send a response
  res.status(200).json({ user, token });
};

export const createLoan = async (req: Request, res: Response) => {
  const {
    loanId,
    clientId,
    agentId,
    principle,
    type,
    duration_in_months,
  } = req.body;

  // 1) Find a valid loan scheme
  const loanScheme = await Loan.findById(loanId);
  if (!loanScheme) {
    throw new NotFoundError('Loan scheme not exist');
  }

  // 2) Check by role
  const user = await User.findById(clientId);
  const agent = await User.findById(agentId);

  // a) User does exist
  if (!user) {
    throw new NotFoundError('user not exist');
  }
  // b) Agent does exist
  if (agentId) {
    if (!agent) {
      throw new NotFoundError('agent not exist');
    }
  }

  const monthlyInterestRate = loanScheme.interestRate / (12 * 100);
  const top = Math.pow(1 + monthlyInterestRate, duration_in_months);
  const bottom = top - 1;

  const emi = Math.round((principle * monthlyInterestRate * top) / bottom);
  const start_date = moment.utc(new Date()).toDate();
  const end_date = moment
    .utc(start_date)
    .add(duration_in_months, 'months')
    .toDate();
  // 3) Add loan to user
  const loan: ILoan = {
    id: new mongoose.mongo.ObjectId(),
    loanId,
    clientId,
    agentId,
    name: user.name,
    principle: Number(principle),
    type,
    status: Status.new,
    emi,
    duration_in_months: Number(duration_in_months),
    rate: loanScheme.interestRate,
    paid_amount: 0,
    start_date,
    end_date,
  };

  user.loans?.push(loan);
  await user.save();

  // @ts-ignore
  const personalLoan = PersonlLoan.build({
    loanId: loan.id,
    userId: clientId,
    loan,
  });
  await personalLoan.save();

  if (agent) {
    agent!.loans?.push(loan);
    await agent!.save();
  }

  // 4) Send a response.
  res.status(200).json({ message: 'success', loanId: loan.id });
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await User.findById(id);
  // Check for user
  if (!user) {
    throw new NotFoundError('user not exist');
  }

  res.status(200).json(user);
};

export const getAllUser = async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).send(users);
};

export const updateDetailsByUser = async (req: Request, res: Response) => {
  // @ts-ignore
  const user = await User.findById(req.user?.id);

  // Check for user
  if (!user) {
    throw new NotFoundError('user not exist');
  }

  const { name, password } = req.body;

  user.name = name ? name : user.name;
  user.password = password ? password : user.password;
  user.loans?.forEach((loan) => (loan.name = name ? name : user.name));

  await user.save();

  const token = generateToken(user);

  res.status(200).json({ user, token });
};

export const updateUsers = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await User.findById(id);

  // Check for user
  if (!user) {
    throw new NotFoundError('user not exist');
  }

  const { name, email, loans, role, active } = req.body;

  user.name = name ? name : user.name;
  user.email = email ? email : user.email;
  user.loans = loans ? loans : user.loans;
  user.role = role ? role : user.role;
  user.active = active ? active : user.active;

  await user.save();
  res.status(200).json(user);
};
