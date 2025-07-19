import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://test:test@ac-g2no3u2-shard-00-00.6pzt1vp.mongodb.net:27017,ac-g2no3u2-shard-00-01.6pzt1vp.mongodb.net:27017,ac-g2no3u2-shard-00-02.6pzt1vp.mongodb.net:27017/slipstreamDB?ssl=true&replicaSet=atlas-yzrpac-shard-0&authSource=admin&retryWrites=true&w=majority";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
