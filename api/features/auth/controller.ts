import { NextFunction, Request, Response } from "express";

import {
  response,
  passport,
  verifyToken,
  setAuthCookies,
  clearAuthCookies,
} from "../../utils";
import { IGoogleUser } from "./types";
import { AuthService } from "./service";
import { User } from "../../models/user";
import { signInSchema } from "./auth.dto";
import { IS_PRODUCTION } from "../../constants/app";
import { userRepository, tokenRepository } from "./../../models/repositories";

export default class AuthController {
  static async signInWithGoogle(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const values = await signInSchema.validateAsync(req.query);

    const { redirectUrl } = values;

    req.session.redirectUrl = redirectUrl;

    passport.authenticate("google", {
      scope: ["profile", "email", "openid"],
      prompt: "select_account",
      includeGrantedScopes: true,
    })(req, res, next);
  }

  static async googleCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      "google",
      {
        accessType: "offline",
      },
      async (err, user: IGoogleUser) => {
        if (err || !user) {
          const url = getAuthCallbackUrl(
            err,
            false,
            null,
            req.session.redirectUrl,
            false
          );
          return res.redirect(url);
        }

        let existingUser = await userRepository.findByGoogleId(user.id);

        if (!existingUser) {
          const newUser = {
            googleId: user.id,
            name: user.name,
            avatar: user.avatar,
            lastLogin: new Date(),
            email: user.emails[0].value,
            googleDisplayName: user.name,
          };

          existingUser = await userRepository.create(newUser as User);
        } else {
          existingUser.lastLogin = new Date();

          await userRepository.update(existingUser._id, existingUser);
        }

        const { accessToken, refreshToken } =
          await AuthService.generateAuthTokens(existingUser);

        setAuthCookies(res, accessToken, refreshToken);

        const url = getAuthCallbackUrl(
          err,
          true,
          accessToken,
          req.session.redirectUrl,
          existingUser.isOnboarded
        );

        return res.redirect(url);
      }
    )(req, res, next);
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.userId;

    clearAuthCookies(res);

    if (userId) {
      await tokenRepository.deleteAllRefreshTokens(userId.toString());
    }

    return response(res, 200, "Logged out successfully");
  }

  static async refreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const refreshToken = req.cookies?.lexi_auth_refresh_token;

    console.log(`cookies: ${JSON.stringify(req.cookies)}`);

    if (!refreshToken) {
      return response(res, 401, "Unauthorized, no refresh token found");
    }

    const decodedToken = verifyToken(refreshToken);

    if (!decodedToken) {
      return response(
        res,
        401,
        "Unauthorized - Invalid or expired refresh token"
      );
    }

    const user = await userRepository.findById(decodedToken.userId as string);

    if (!user) {
      return response(res, 401, "Unauthorized - User not found");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await AuthService.generateAuthTokens(user);

    setAuthCookies(res, accessToken, newRefreshToken);

    return response(res, 200, "Access token refreshed successfully", {
      accessToken,
    });
  }
}
const getAuthCallbackUrl = (
  error: string,
  success: boolean,
  accessToken: string | null,
  redirectUrl: string,
  isOnboarded?: boolean
) => {
  const baseParams = success
    ? `success=${success}&message=Google authentication successful&accessToken=${accessToken}&isOnboarded=${isOnboarded}`
    : `success=${success}&error=${error}`;

  return IS_PRODUCTION
    ? `https://uselexi.xyz/auth/callback?${baseParams}&redirectUrl=${redirectUrl}`
    : `http://localhost:3000/auth/callback?${baseParams}&redirectUrl=${redirectUrl}`;
};
