export interface ITokenPosition {
  end: number;
  text: string;
  start: number;
  elementId: string;
  elementType: "p" | "h1" | "h2" | "h3" | "li" | "span";
}

export interface IStructuredContract {
  html: string;
  tokens: ITokenPosition[];
  metadata: {
    listCount: number;
    totalTokens: number;
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
    totalTokens: number;
    headingCount: number;
    paragraphCount: number;
  };
  tokens: ITokenPosition[];
}
