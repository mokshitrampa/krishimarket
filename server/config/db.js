const mongoose = require('mongoose');
const config = require('./config');

let mongod = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Could not connect to configured URI (${config.mongoUri}): ${error.message}`);
    
    // In dev mode, if local MongoDB is not running, fallback to MongoMemoryServer
    if (config.nodeEnv !== 'production') {
      try {
        console.log('[MongoDB] Starting fallback in-memory MongoDB server...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        console.log(`[MongoDB] Fallback in-memory MongoDB running at: ${memoryUri}`);
        const conn = await mongoose.connect(memoryUri);
        console.log('[MongoDB] Connected to in-memory MongoDB.');

        // Automatically auto-seed in-memory database if empty
        const { checkAndSeed } = require('../seed/seeder');
        await checkAndSeed();
        return conn;
      } catch (memErr) {
        console.error('[MongoDB] Failed to start in-memory MongoDB:', memErr.message);
        throw memErr;
      }
    } else {
      console.error('[MongoDB] Fatal database connection error in production:', error);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};

module.exports = { connectDB, disconnectDB };