import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { generalLimiter } from "./middleware/rateLimiters.js";
import routes from "./routes.js";
import errorHandler from "./require/errorHandler.js";
import logger from "./require/logger.js";

const app = express();
app.set("trust proxy", process.env.TRUST_PROXY_HOPS ?? 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
    customSuccessMessage: (req, res) =>
      `${req.method} ${req.url} -> ${res.statusCode}`,
    customErrorMessage: (req, res, err) =>
      `${req.method} ${req.url} -> ${res.statusCode} (${err.message})`,
    autoLogging: {
      ignore: (req) => req.url?.startsWith("/api/health"),
    },
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "req.body.password",
      ],
      remove: true,
    },
  }),
);

app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(generalLimiter);

app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

app.use("/api", routes);

app.use(errorHandler);

export default app;
