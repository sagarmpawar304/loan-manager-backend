import { Role, ILoan, PaymentHistory } from '../interfaces/modelInterfaces';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserInfo {
  name: string;
  email: string;
  password: string;
  loans?: ILoan[];
  role?: Role;
}

export interface UserDoc extends mongoose.Document<UserInfo> {
  id: string;
  name: string;
  email: string;
  password: string;
  loans?: ILoan[];
  payment_history?: PaymentHistory[];
  role: Role;
  active: boolean;
  passwordUpdatedAt: Date;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build: (attr: UserInfo) => UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: Role.customer },
    password: { type: String, required: true },
    loans: [],
    payment_history: [],
    active: { type: Boolean, default: true },
    passwordUpdatedAt: Date,
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const incryptedPassword = await bcrypt.hash(this.get('password'), 12);
  this.set('password', incryptedPassword);

  this.set('passwordUpdatedAt', new Date());

  next();
});

userSchema.statics.build = (attr: UserInfo) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
