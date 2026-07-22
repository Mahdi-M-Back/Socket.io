import { Router } from "express";
import * as controller from "./controller.js";
import verify from "./../../require/jwt.js";

const router = Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/refresh-token", controller.refreshToken);

router.use(verify.protect);

router
  .route("/me")
  .patch(controller.updateMe)
  .get(controller.getMe)
  .delete(controller.deleteMe);

router.post("/logout", controller.logout);

export default router;
