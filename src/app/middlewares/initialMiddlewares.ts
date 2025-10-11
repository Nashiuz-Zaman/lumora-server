import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "@config/env";

const allowedOrigins = [
  config.prodClientURL, // "https://lumora-client.vercel.app"
  "https://lumora-client-85n1.onrender.com",
];

if (config.environment !== "production") {
  allowedOrigins.push("http://localhost:3000");
}

export const initialMiddlewares = (app: Express) => {
  // Dynamic origin check
  const corsOptions = {
    origin: (origin: string | undefined, callback: any) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };

  // SSLCommerz routes first (allow any origin)
  app.options(
    "/api/v1/payments/result",
    cors({ origin: true, credentials: true })
  );
  app.options(
    "/api/v1/payments/ipn",
    cors({ origin: true, credentials: true })
  );
  app.use("/api/v1/payments/result", cors({ origin: true, credentials: true }));
  app.use("/api/v1/payments/ipn", cors({ origin: true, credentials: true }));

  app.options("*", cors(corsOptions));
  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};
