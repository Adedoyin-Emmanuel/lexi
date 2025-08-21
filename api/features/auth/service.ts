import dayjs from "dayjs";

import { User } from "../../models/user";
import { JwtUser } from "../../types/types";
import { Token, TOKEN_TYPE } from "../../models/token";
import { tokenRepository } from "../../models/repositories";
import { generateAccessToken, generateRefreshToken } from "../../utils";

export class AuthService {
  static async generateAuthTokens(user: User) {
    const payload = {
      email: user.email,
      userId: user._id.toString(),
      avatar:
        user.avatar ||
        `https://api.dicebear.com/7.x/micah/svg?seed=${user.name.trim()}`,
      name: user.name,
    };

    const accessToken = generateAccessToken(payload as JwtUser);
    const refreshToken = generateRefreshToken(payload as JwtUser);

    const accessTokenExpiry = dayjs().add(1, "hour").toDate();
    const refreshTokenExpiry = dayjs().add(30, "day").toDate();

    await tokenRepository.deleteAllRefreshTokens(user._id.toString());

    await tokenRepository.create({
      userId: user._id,
      token: refreshToken,
      type: TOKEN_TYPE.REFRESH_TOKEN,
      expiresAt: refreshTokenExpiry,
    } as Token);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiry,
      refreshTokenExpiry,
    };
  }
}
