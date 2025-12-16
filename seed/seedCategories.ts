import { connectDb } from "../src/config/db";
import { seedCategories } from "../src/app/modules/category/service/seedCategories";

const run = async () => {
  await connectDb();
  await seedCategories();
  console.log("Categories seeded ✅");
  process.exit(0);
};

run();
