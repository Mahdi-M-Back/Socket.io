import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import { connectToDB } from "./require/configDB.js";

async function bootstrap() {
  await connectToDB();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server started on ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
