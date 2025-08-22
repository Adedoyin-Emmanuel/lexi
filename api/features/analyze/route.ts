import { Router } from "express";

import AnalyzeController from "./controller";
import { useAuth } from "./../../middlewares";

const router = Router();

router.post("/", [useAuth], (req, res) => AnalyzeController.analyze(req, res));

export default router;
