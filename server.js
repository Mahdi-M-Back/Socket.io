import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

import { connectToDB } from "./require/configDB.js";

async function bootstrap() {
  await connectToDB();

  const port = process.env.PORT || 3000;

  const server = app.listen(port, () => {
    console.log(`Server started on ${port}`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Closing server...");

    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received. Closing server...");

    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
