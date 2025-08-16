import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const allowedOrigins = ["http://localhost:3000"];

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
