import { Repository } from "../base/repository";
import { ITokenRepository } from "./i-token-repository";
import { Token, TokenModel, TOKEN_TYPE } from "../../token";

class TokenRepository extends Repository<Token> implements ITokenRepository {
  constructor() {
    super(TokenModel);
  }
  async findByToken(token: string): Promise<Token | null> {
    return TokenModel.findOne({
      token,
    }).exec();
  }

  async deleteAllRefreshTokens(userId: string) {
    await TokenModel.deleteMany({
      userId,
      type: TOKEN_TYPE.REFRESH_TOKEN,
    });
  }
}

const tokenRepository = new TokenRepository();

export default tokenRepository;
