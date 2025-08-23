import { Router } from "express";

import MetricsController from "./controller";
import { useAuth } from "./../../middlewares";

const router = Router();

router.get("/dashboard", [useAuth], MetricsController.getDashboardStats);

router.get(
  "/recent-contracts",
  [useAuth],
  MetricsController.getDashboardRecentContracts
);

export default router;
