const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/teamdd_revelations';
    if (!process.env.MONGODB_URI) {
      console.warn(
        '[config] MONGODB_URI is not set; defaulting to local MongoDB at mongodb://127.0.0.1:27017/teamdd_revelations'
      );
      console.warn('[config] Create backend/.env to override this for MongoDB Atlas or a different local URI.');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('If you are using local MongoDB, ensure it is running. If you are using Atlas, set MONGODB_URI in backend/.env');
    process.exit(1);
  }
};

module.exports = connectDB;
