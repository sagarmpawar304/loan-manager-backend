import { app } from './app';
import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    if (!mongoUri) {
      throw new Error('Please provide mongodb atlas uri');
    }
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('Connected to database');
  } catch (error) {
    console.log(error);
  }
  app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
  });
};

start();
