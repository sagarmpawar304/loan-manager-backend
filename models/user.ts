import { Role, Loan } from './../interfaces/modelInterfaces';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

interface UserInfo {
  name: string;
  email: string;
  password: string;
  loans?: Loan[];
  role: Role;
}

interface UserDoc extends mongoose.Document<UserInfo> {
  name: string;
  email: string;
  password: string;
  loans?: string;
  role: Role;
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
    loans: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const incryptedPassword = await bcrypt.hash(this.get('password'), 12);
  this.set('password', incryptedPassword);

  next();
});

userSchema.statics.build = (attr: UserInfo) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
