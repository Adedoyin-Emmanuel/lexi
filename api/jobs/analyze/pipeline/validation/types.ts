import { CONTRACT_TYPE } from "./../../../../models/document/interfaces";

export interface IValidationResult {
  reason: string;
  inScope: boolean;
  confidenceScore: number;
  isValidContract: boolean;
  contractType: CONTRACT_TYPE;
}

export interface IValidationError {
  error: string;
  success: false;
}

export type ValidationResponse =
  | { success: true; data: IValidationResult }
  | IValidationError;
