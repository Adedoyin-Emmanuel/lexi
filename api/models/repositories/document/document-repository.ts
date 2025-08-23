import { Repository } from "../base/repository";
import { IDocumentRepository } from "./i-document-repository";
import { Document, DocumentModel } from "../../document";

class DocumentRepository
  extends Repository<Document>
  implements IDocumentRepository
{
  constructor() {
    super(DocumentModel);
  }
  findAllDocumentsByUserId(userId: string): Promise<Document[]> {
    return DocumentModel.find({ userId }).exec();
  }

  getRecentContractsByUserId(userId: string): Promise<Document[]> {
    return DocumentModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();
  }
}

const documentRepository = new DocumentRepository();

export default documentRepository;
