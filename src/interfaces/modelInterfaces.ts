import mongoose from 'mongoose';

export enum Role {
  customer = 'customer',
  admin = 'admin',
  agent = 'agent',
}

export enum Status {
  approved = 'APPROVED',
  new = 'NEW',
  rejected = 'REJECTED',
}

export enum LoanTypes {
  personalLoan = 'personal loan',
}

export interface ILoan {
  id: mongoose.Types.ObjectId;
  loanId: mongoose.Types.ObjectId;
  clientId: string;
  agentId: string;
  name: string;
  type: LoanTypes;
  status: Status;
  principle: number;
  duration_in_months: number;
  emi: number;
  paid_amount: number;
  rate: number;
  start_date: Date;
  end_date: Date;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'REJECTED',
  REJECTED = 'REJECTED',
}

export enum PaymentMode {
  CASH = 'CASH',
  ONLINE = 'ONLINE',
}

export interface PaymentDetails {
  amount: number;
  source: string;
}

export interface PaymentHistory {
  loanId: string;
  paymentDate: Date;
  status: PaymentStatus;
  paymentMode: PaymentMode;
  paymentDetails: PaymentDetails;
}
