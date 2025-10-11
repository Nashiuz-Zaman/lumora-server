import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "@config/env";

const allowedOrigins = [
  config.prodClientURL, // "https://lumora-client.vercel.app"
  "https://lumora-client-85n1.onrender.com",
  "https://sandbox.sslcommerz.com",
];

if (config.environment !== "production") {
  allowedOrigins.push("http://localhost:3000");
}

export const initialMiddlewares = (app: Express) => {
  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};
