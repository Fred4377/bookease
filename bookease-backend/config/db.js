const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookease';
    mongoose.set('strictQuery', false);

    console.log(`Attempting to connect to MongoDB: ${mongoURI}`);
    
    try {
      // Attempt connection with a short timeout to fail fast if no local server exists
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 3000
      });
      console.log('MongoDB Connected (External/Local Service)');
    } catch (err) {
      console.log('Local/External MongoDB service not detected. Starting programmatical in-memory MongoDB...');
      
      // Spin up in-memory MongoDB on port 27017
      mongod = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          dbName: 'bookease'
        }
      });

      const uri = mongod.getUri();
      console.log(`In-Memory MongoDB Server running at: ${uri}`);
      
      await mongoose.connect(uri);
      console.log('MongoDB Connected (In-Memory)');
    }
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
