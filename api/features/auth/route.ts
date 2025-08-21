import { Router } from "express";

import AuthController from "./controller";
import { useAuth } from "../../middlewares";

const router = Router();

router.get("/google", AuthController.signInWithGoogle);

router.get("/google/callback", AuthController.googleCallback);

router.post("/logout", [useAuth], AuthController.logout);

router.post("/refresh-token", AuthController.refreshAccessToken);

export default router;
