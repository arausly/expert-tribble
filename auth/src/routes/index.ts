import express from "express";
import { body } from "express-validator";

const router = express.Router();

//controllers
import CurrentUserController from "../controllers/user.controller";
import { currentUser, validateRequest } from "@dtut/common";

router.get("/currentuser", currentUser, CurrentUserController.getCurrentUser);
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("please provide valid email"),
    body("password").trim().isLength({ min: 5, max: 20 }),
  ],
  validateRequest,
  CurrentUserController.signUp
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide valid email"),
    body("password").trim().notEmpty().withMessage("please provide password"),
  ],
  validateRequest,
  CurrentUserController.signIn
);
router.post("/signout", CurrentUserController.signOut);

export default router;
