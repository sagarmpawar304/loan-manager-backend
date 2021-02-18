import { LoanTypes } from './../interfaces/modelInterfaces';
import mongoose from 'mongoose';

interface LoanInfo {
  name: string;
  interestRate: number;
  type: LoanTypes;
}

interface LoanDoc extends mongoose.Document<LoanInfo> {
  name: string;
  interestRate: number;
  type: LoanTypes;
}

interface LoanModel extends mongoose.Model<LoanDoc> {
  build: (attr: LoanInfo) => LoanDoc;
}

const loanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    interestRate: { type: String },
    type: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const Loan = mongoose.model<LoanDoc, LoanModel>('Loan', loanSchema);

export default Loan;
