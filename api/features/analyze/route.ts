import { Router } from "express";

import AnalyzeController from "./controller";
import { useAuth } from "./../../middlewares";

const router = Router();

router.post("/", [useAuth], AnalyzeController.analyze);

export default router;
