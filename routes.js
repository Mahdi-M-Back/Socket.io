import { Router } from "express";
const router = Router();

import userRouter from "./module/user/router.js";
import chatRouter from "./module/chat/router.js";

router.use("/user", userRouter);
router.use("/chat", chatRouter);

export default router;
