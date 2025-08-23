import { Document } from "../../document";
import { IRepository } from "../base/i-repository";
import { IContractFilters } from "./document-repository";

export interface IDocumentRepository extends IRepository<Document> {
  findAllDocumentsByUserId(userId: string): Promise<Document[]>;
  getRecentContractsByUserId(userId: string): Promise<Document[]>;
  getUserContractsByFilters(
    userId: string,
    filters: IContractFilters
  ): Promise<{ documents: Document[]; total: number }>;

  getContractById(contractId: string, userId: string): Promise<Document | null>;
}
