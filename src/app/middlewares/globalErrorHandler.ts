import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "@app/classes/AppError";

// Helper to keep the handler clean
const sendResponse = (error: AppError, res: Response) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      status,
      message: error.message,
      stack: error.stack,
      error: error,
    });
  } else {
    res.status(statusCode).json({
      status,
      message: error.isOperational
        ? error.message
        : "Something went wrong. Please try later",
    });
  }
};

export const globalErrorHandler = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  // 1. --- CHECK IF ALREADY AN APPERROR ---
  if (error instanceof AppError) {
    return sendResponse(error, res);
  }

  // 2. --- MONGOOSE DUPLICATE KEY ERROR (E.G., UNIQUE: TRUE) ---
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    error = new AppError(
      `The ${field} already exists. Please use another.`,
      400,
    );
  }

  // 3. --- MONGOOSE VALIDATION ERRORS ---
  else if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((el: any) => el.message);
    error = new AppError(`Invalid input data: ${messages.join(". ")}`, 400);
  }

  // 4. --- MONGOOSE CAST ERROR (E.G., INVALID OBJECTID) ---
  else if (err instanceof mongoose.Error.CastError) {
    error = new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
  }

  // 5. --- MONGOOSE DISCONNECTED/TIMEOUT (SIMILAR TO P1001) ---
  else if (err.name === "MongooseServerSelectionError") {
    error = new AppError(
      "Database connection issue. Please try again in a few seconds.",
      503,
    );
  }

  // 6. --- FINAL FALLBACK ---
  if (!(error instanceof AppError)) {
    error = new AppError(
      err.message || "Internal Server Error",
      err.statusCode || 500,
    );

    // Mark as non-operational if it's a generic 500 to hide details in production
    if (!err.statusCode || err.statusCode === 500) {
      error.isOperational = false;
    }
  }

  return sendResponse(error, res);
};
