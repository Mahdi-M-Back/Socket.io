import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import cors from "cors";
import router from "./routes.js";
import helmet from "helmet";
import errorHandler from "./require/errorHandler.js";
import rateLimit from "express-rate-limit";

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later.",
    },
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.use("/api", router);

app.use(errorHandler);
export default app;
