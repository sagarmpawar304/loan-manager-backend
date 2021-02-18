import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import globleErrorHandler from './middlewares/globleErrorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

app.get('/', (req, res) => {
  res.send('API is running.....');
});

app.use(globleErrorHandler);

export { app };
