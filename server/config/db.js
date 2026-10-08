import mongoose from 'mongoose';

/**
 * Connect to MongoDB instance using Mongoose
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resumeforge';
    
    // Set mongoose connection options
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}\x1b[0m`);
    return conn;
  } catch (error) {
    console.error(`\x1b[31m✖ MongoDB Connection Error: ${error.message}\x1b[0m`);
    console.error('\x1b[33mℹ Tip: Ensure MongoDB is running locally, or supply a valid MONGODB_URI in server/.env (e.g. MongoDB Atlas cluster connection string).\x1b[0m');
    // If running in development, do not crash the entire process so API health endpoints can still serve info
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
