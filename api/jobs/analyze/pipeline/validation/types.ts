export interface IValidationResult {
  reason: string;
  inScope: boolean;
  confidenceScore: number;
  isValidContract: boolean;
  contractType: "NDA" | "ICA" | "License Agreement" | "Other";
}

export interface IValidationError {
  error: string;
  success: false;
}

export type ValidationResponse =
  | { success: true; data: IValidationResult }
  | IValidationError;
