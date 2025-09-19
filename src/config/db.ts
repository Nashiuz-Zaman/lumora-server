// import
import mongoose from "mongoose";
import { config } from "./env";

interface IConnection {
  isConnected: boolean;
}

const connection: IConnection = { isConnected: false };

export const connectDb = async (): Promise<void> => {
  try {
    if (connection.isConnected) {
      return;
    }

    // Global transform for all schemas
    const globalSchemaConfig = {
      versionKey: false, // remove __v
      id: false,
    };

    mongoose.set("toJSON", globalSchemaConfig);
    mongoose.set("toObject", globalSchemaConfig);

    const db = await mongoose.connect(config.mongoUri);

    if (db.connection.readyState === 1) {
      console.log("Database connected correctly ✅✅");
      connection.isConnected = true;
    } else {
      console.log("Database connection failed ❌❌");
      connection.isConnected = false;
    }
  } catch (err) {
    connection.isConnected = false;
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};
