import { Router } from "express";

import AuthController from "./controller";

const router = Router();

router.get("/google");
router.post("/logout");

router.post("/refresh-token");

export default router;
