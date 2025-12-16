import { connectDb } from "../src/config/db";
import { seedProductCollections } from "../src/app/modules/productCollection/service/seedProductCollections";

const run = async () => {
  await connectDb();
  await seedProductCollections();
  console.log("Product collections seeded ✅");
  process.exit(0);
};

run();
