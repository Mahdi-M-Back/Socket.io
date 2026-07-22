import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import router from "./routes.js";
import helmet from "helmet";

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.use("/api", router);

export default app;
