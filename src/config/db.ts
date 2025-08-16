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
    console.log("Error connecting to the database");

    process.exit(1);
  }
};
