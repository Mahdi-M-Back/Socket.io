import { Router } from "express";
import * as controller from "./controller.js";
import verify from "./../../require/jwt.js";
import asyncHandler from "./../../require/asyncHandler.js";
import validate from "../../middleware/validate.js";
import { signupSchema, loginSchema, updateMeSchema } from "./schema.js";

const router = Router();

router.post("/signup", validate(signupSchema), asyncHandler(controller.signup));
router.post("/login", validate(loginSchema), asyncHandler(controller.login));
router.post("/refresh-token", asyncHandler(controller.refreshToken));

router.use(verify.protect);

router
  .route("/me")
  .patch(validate(updateMeSchema), asyncHandler(controller.updateMe))
  .get(asyncHandler(controller.getMe))
  .delete(asyncHandler(controller.deleteMe));

router.post("/logout", asyncHandler(controller.logout));

export default router;
