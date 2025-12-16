import { connectDb } from "../src/config/db";
import { seedBackupProductCollections } from "../src/app/modules/backupProductCollection/service/seedBackupProductCollections";

const run = async () => {
  await connectDb();
  await seedBackupProductCollections();
  console.log("Backup product collections seeded ✅");
  process.exit(0);
};

run();
