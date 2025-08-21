import { IRepository } from "../base/i-repository";
import { Token } from "../../token";

export interface ITokenRepository extends IRepository<Token> {
  findByToken(token: string): Promise<Token | null>;
  deleteAllRefreshTokens(userId: string): Promise<void>;
}
