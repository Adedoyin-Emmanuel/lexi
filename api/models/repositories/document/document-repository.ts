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
}

const documentRepository = new DocumentRepository();

export default documentRepository;
