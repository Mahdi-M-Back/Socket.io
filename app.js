import express from "express";
const app = express();
import router from "./routes.js";
import helemt from "helemt";

app.use(cookieParser());
app.use(express.json());
app.use(helemt());

app.use("/api", router);

export default app;
