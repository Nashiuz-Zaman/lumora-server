import { clientDomain, clientUrl, server } from "./app/app";
import { config } from "./config/env";
import { connectDb } from "@config/db";
import { seedInitialData } from "@app/modules/initial/seedInitialData";

// get port number
const port = config.port;

// start server
const main = async (): Promise<void> => {
  await connectDb();
  await seedInitialData();

  try {
    server.listen(port, () => {
      console.log(
        `- Server working\n- Port: ${port}\n- Environment: ${config.environment}\n- Client Domain: ${clientDomain}\n- Client URL: ${clientUrl}`
      );
    });
  } catch (error) {
    console.error(`Server failed ❌❌\n${error}`);

    process.exit(1);
  }
};

main();
