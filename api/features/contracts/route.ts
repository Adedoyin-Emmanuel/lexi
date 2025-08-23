import { Router } from "express";

import ContractController from "./controller";
import { useAuth } from "./../../middlewares";

const router = Router();

router.get("/", [useAuth], ContractController.getContracts);

router.get("/:id", [useAuth], ContractController.getContractById);

router.get("/:id/download", [useAuth], ContractController.downloadSummary);

export default router;
