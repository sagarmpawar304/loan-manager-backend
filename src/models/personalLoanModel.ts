import { Status } from './../interfaces/modelInterfaces';
import { ILoan, LoanTypes } from '../interfaces/modelInterfaces';
import mongoose from 'mongoose';

interface LoanInfo {
  loanId: mongoose.Types.ObjectId;
  userId: string;
  status: Status;
  loan: ILoan;
}

interface LoanDoc extends mongoose.Document<LoanInfo> {
  loanId: mongoose.Types.ObjectId;
  userId: string;
  status: Status;
  loan: ILoan;
  history: [ILoan];
}

interface LoanModel extends mongoose.Model<LoanDoc> {
  build: (attr: LoanInfo) => LoanDoc;
}

const loanSchema = new mongoose.Schema(
  {
    loanId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: Status.new,
      enum: [Status.approved, Status.new, Status.rejected],
    },
    loan: { type: {}, required: true, default: {} },
    history: { type: [], default: [] },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

loanSchema.statics.build = (attr: LoanInfo) => {
  return new PersonlLoan(attr);
};

const PersonlLoan = mongoose.model<LoanDoc, LoanModel>(
  'PersonlLoan',
  loanSchema
);

export default PersonlLoan;
