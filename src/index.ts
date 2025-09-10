import { config } from "./config/env";
import { clientDomain, clientUrl, server } from "./app/app";
import { connectDb } from "./config/db";
// import { seedCategories } from "./app/modules/category/service/seedCategories";
// import { seedSuperAdmin } from "@app/modules/admin/services";
// import { seedProductCollections } from "@app/modules/productCollection/service/seedProductCollections";

const port = config.port;

const main = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDb();

    // Seed database only in development or if explicitly allowed
    if (config.environment !== "production") {
      console.log("Seeding initial data...");
      try {
        // await seedSuperAdmin();
        // await seedCategories();
        // await seedProductCollections();
        console.log("Database seeding completed ✅");
      } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1); // stop server if seeding fails
      }
    }

    // Start server
    server.listen(port, () => {
      console.log(
        `Server running\nPort: ${port}\nEnvironment: ${config.environment}\nClient Domain: ${clientDomain}\nClient URL: ${clientUrl}`
      );
    });
  } catch (err) {
    console.error("Server failed to start ❌", err);
    process.exit(1);
  }
};

main();
