import mongoose from "mongoose";
import { MongoClient, Db } from "mongodb";

let isMongooseConnected = false;
let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

export async function connectMongoose() {
  if (isMongooseConnected) return mongoose;
  await mongoose.connect(process.env.MONGODB_URI as string);
  isMongooseConnected = true;
  console.log("Mongoose connected");
  return mongoose;
}

export async function connectNative(): Promise<Db> {
  if (mongoDb) return mongoDb;
  mongoClient = new MongoClient(process.env.MONGODB_URI as string);
  await mongoClient.connect();
  mongoDb = mongoClient.db();
  console.log("Native MongoDB connected");
  return mongoDb;
}
