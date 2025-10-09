if (process.env.NODE_ENV !== "production") {
  import("module-alias/register").then(() => {
    console.log("Module alias loaded for dev");
  });
}

import { config } from "./config/env";
import { clientDomain, clientUrl, server } from "./app";
import { connectDb } from "./config/db";
import { seedCategories } from "./app/modules/category/service/seedCategories";
import { seedProductCollections } from "@app/modules/productCollection/service/seedProductCollections";
import { seedBackupProductCollections } from "@app/modules/backupProductCollection/service";
import { seedSuperAdminAndDemoAdmin } from "@app/modules/admin/services";

const port = config.port;

const main = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDb();

    // Seed database only in development or if explicitly allowed
    if (config.environment !== "production") {
      console.log("Seeding initial data...");
      try {
        // await seedSuperAdminAndDemoAdmin();
        // await seedCategories();
        // await seedProductCollections();
        // await seedBackupProductCollections()
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
