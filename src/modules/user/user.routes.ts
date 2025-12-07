import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import verifyAccess from "../../middleware/verifyAccess";

const router = Router();

router.get("/", auth(), verifyAccess(["admin"]), userController.GetAllUsers);

router.put(
  "/:userId",
  auth(),
  verifyAccess(["admin", "customer"]),
  userController.UpdateUserById
);

router.delete(
  "/:userId",
  auth(),
  verifyAccess(["admin"]),
  userController.DeleteUserById
);

export const userRoutes = router;
