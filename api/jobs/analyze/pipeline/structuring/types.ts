export interface IStructuredContract {
  html: string;
  metadata: {
    listCount: number;
    headingCount: number;
    paragraphCount: number;
  };
}

export interface IStructuringResult {
  error?: string;
  success: boolean;
  data?: IStructuredContract;
}

export interface ILLMStructureResponse {
  html: string;
  metadata: {
    listCount: number;
    headingCount: number;
    paragraphCount: number;
  };
}
