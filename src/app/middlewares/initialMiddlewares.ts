import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "@config/env";

const allowedOrigins = [
  config.prodClientURL, // e.g. "https://lumora-client.vercel.app"
  "https://lumora-client-85n1.onrender.com",
];

if (config.environment !== "production") {
  allowedOrigins.push("http://localhost:3000");
}

export const initialMiddlewares = (app: Express) => {
  //  SSLCommerz routes first — allow any origin (even 'null')
  const sslCors = cors({
    origin: (origin, callback) => {
      if (!origin || origin === "null") {
        // allow SSLCommerz redirects & no-origin requests
        return callback(null, true);
      }
      // allow any origin dynamically (safe for payment callbacks)
      return callback(null, true);
    },
    credentials: true,
  });

  app.options("/api/v1/payments/result", sslCors);
  app.options("/api/v1/payments/ipn", sslCors);
  app.use("/api/v1/payments/result", sslCors);
  app.use("/api/v1/payments/ipn", sslCors);

  //  Global CORS for normal app routes
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

  app.options("*", cors(corsOptions));
  app.use(cors(corsOptions));

  //  Standard middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};
