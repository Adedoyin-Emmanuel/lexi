import { Repository } from "../base/repository";
import { IDocumentRepository } from "./i-document-repository";
import { Document, DocumentModel } from "../../document";

export interface IContractFilters {
  sort: string;
  skip: number;
  take: number;
  sortOrder: string;
  statusFilter: string;
}

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

  getUserContractsByFilters(
    userId: string,
    filters: IContractFilters
  ): Promise<Document[]> {
    const { sort, take, skip, sortOrder, statusFilter } = filters;

    const filter: any = { userId };

    if (statusFilter !== "ALL") {
      filter.status = statusFilter;
    }

    let sortObj: any = {};
    if (sort) {
      if (sort === "riskScore") {
        sortObj["summary.overallRiskScore"] = sortOrder === "asc" ? 1 : -1;
      } else if (sort === "confidenceScore") {
        sortObj["summary.overallConfidenceScore"] =
          sortOrder === "asc" ? 1 : -1;
      } else {
        sortObj[sort] = sortOrder === "asc" ? 1 : -1;
      }
    } else {
      sortObj = { createdAt: sortOrder === "asc" ? 1 : -1 };
    }

    return DocumentModel.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
  }

  getContractById(
    contractId: string,
    userId: string
  ): Promise<Document | null> {
    return DocumentModel.findOne({ _id: contractId, userId }).exec();
  }
}

const documentRepository = new DocumentRepository();

export default documentRepository;
