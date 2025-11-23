import dotenv from 'dotenv';
import connectDB from './db.js';
import { app } from '../app.js'

dotenv.config();
// console.log("000000000000000000000000000000");

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port} hello`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

startServer();