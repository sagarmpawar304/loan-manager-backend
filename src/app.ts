import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';

import globleErrorHandler from './middlewares/globleErrorHandler';
import { userRouter } from './routes/users/userRoutes';
import { loanRouter } from './routes/loans/loanRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: true, limit: '3mb' }));

app.get('/', (req, res) => {
  res.send('API is running.....');
});

app.use(userRouter);
app.use(loanRouter);

app.use(globleErrorHandler);

console.log(process.env.NODE_ENV);

export { app };
