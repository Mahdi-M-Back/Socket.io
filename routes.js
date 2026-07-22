import { Router } from "express";
const router = Router();

import userRouter from "./module/user/router.js";
import chatRouter from "./module/chat/router.js";

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

router.use("/users", userRouter);
router.use("/chats", chatRouter);

export default router;
