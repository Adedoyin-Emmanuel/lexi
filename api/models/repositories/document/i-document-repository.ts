import { IRepository } from "../base/i-repository";
import { Document } from "../../document";

export interface IDocumentRepository extends IRepository<Document> {
  findAllDocumentsByUserId(userId: string): Promise<Document[]>;
  getRecentContractsByUserId(userId: string): Promise<Document[]>;
}
