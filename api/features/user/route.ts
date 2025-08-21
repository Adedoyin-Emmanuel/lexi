import { Router } from "express";

import UserController from "./controller";
import { useAuth } from "./../../middlewares";

const router = Router();

router.post("/onboard", [useAuth], UserController.onboardUser);

router.put("/", [useAuth], UserController.updateUserDetails);
