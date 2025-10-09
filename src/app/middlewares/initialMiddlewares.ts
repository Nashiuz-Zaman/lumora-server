import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "@config/env";

let allowedOrigins = [
  config.prodClientURL,
  "https://lumora-client-85n1.onrender.com", // the client that was deployed in render
];

if (config.environment !== "production") {
  allowedOrigins = [...allowedOrigins, "http://localhost:3000"];
}

export const initialMiddlewares = (app: Express): void => {
  // Handle preflight requests first
  app.options(
    "*",
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};
