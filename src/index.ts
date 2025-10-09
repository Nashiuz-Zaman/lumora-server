import express, { NextFunction, Request, Response } from "express";
import http from "http";

// Config
import { config } from "@config/env";

// Database
import { connectDb } from "@config/db";

// Classes & Utils
import { AppError } from "@app/classes";
import { renderHomePage } from "@utils/index";

// Middlewares
import { initialMiddlewares, globalErrorHandler } from "@app/middlewares";

// Routers
import mainRouter from "@app/main-router";

// Seeding services
import { seedCategories } from "@app/modules/category/service/seedCategories";
import { seedProductCollections } from "@app/modules/productCollection/service/seedProductCollections";
import { seedBackupProductCollections } from "@app/modules/backupProductCollection/service";
import { seedSuperAdminAndDemoAdmin } from "@app/modules/admin/services";

// ------------------------------------------------------
// Client info
export const clientUrl: string =
  config.environment === "development"
    ? `${config.devClientURL}`
    : `${config.prodClientURL}`;

export const clientDomain: string =
  config.environment === "development"
    ? `${config.devClientDomain}`
    : `${config.prodClientDomain}`;

// ------------------------------------------------------
// Express app + server
export const app = express();
export const server = http.createServer(app);

// Apply middlewares
initialMiddlewares(app);

// Root route
app.get("/", (_, res: Response) => {
  res.send(renderHomePage("Hello world", "Lumora Server | Home"));
});

// Health check route
app.get("/health", (_, res: Response) => {
  res.send("Working properly");
});

// API routes
app.use(`/api/${config.apiVersion}`, mainRouter);

// 404 handler
app.all("*", (req: Request, _: any, next: NextFunction) => {
  next(new AppError(`${req.url} is an invalid url`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// ------------------------------------------------------
// Server start + DB + seeding
const port = config.port;

const main = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDb();

    // Seed DB in non-prod environments
    if (config.environment !== "production") {
      console.log("Seeding initial data...");
      try {
        await seedSuperAdminAndDemoAdmin();
        await seedCategories();
        await seedProductCollections();
        await seedBackupProductCollections();
        console.log("Database seeding completed ✅");
      } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
      }
    }

    // Start server
    app.listen(port, () => {
      console.log(
        `Server running\nPort: ${port}\nEnvironment: ${config.environment}\nClient Domain: ${clientDomain}\nClient URL: ${clientUrl}`
      );
    });
  } catch (err) {
    console.error("Server failed to start ❌", err);
    process.exit(1);
  }
};

// Start everything
main();

export default app;
