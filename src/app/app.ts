import express, { NextFunction, Request, Response } from "express";
import { AppError } from "./classes/AppError";
import { config } from "../config/env";
import mainRouter from "./main-router";
import { initialMiddlewares, globalErrorHandler } from "./middlewares";
import http from "http";

export const clientUrl: string =
  config.environment === "development"
    ? `${config.devClientURL}`
    : `${config.prodClientURL}`;

export const clientDomain: string =
  config.environment === "development"
    ? `${config.devClientDomain}`
    : `${config.prodClientDomain}`;

const app = express();
export const server = http.createServer(app);
// Initialize middlewares
initialMiddlewares(app);

// Root route
app.get("/", (_, res: Response) => {
  res.send("Hello world");
});

// Server health test route
app.get("/health", (_, res: Response) => {
  res.send("Working properly");
});

//  Initialize routes
app.use(`/api/${config.apiVersion}`, mainRouter);

// Error handling for invalid URLs
app.all("*", (req: Request, _: any, next: NextFunction) => {
  const error = new AppError(`${req.url} is an invalid url`, 404);
  next(error);
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
