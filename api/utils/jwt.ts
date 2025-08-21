import jwt from "jsonwebtoken";

import { JwtUser } from "../types/types";
import { IS_PRODUCTION } from "../constants/app";

const JWT_SECRET = process.env.JWT_SECRET;

const ACCESS_TOKEN_EXPIRY = IS_PRODUCTION ? "30m" : "1h";

const REFRESH_TOKEN_EXPIRY = "30d";

export const generateAccessToken = (payload: JwtUser): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (payload: JwtUser): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyToken = (token: string): JwtUser | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUser;
  } catch (error) {
    return null;
  }
};

export const setAuthCookies = (
  res: any,
  accessToken: string,
  refreshToken: string
): void => {
  const accessTokenMaxAge = IS_PRODUCTION ? 15 * 60 * 1000 : 60 * 60 * 1000;
  const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

  res.cookie("lexi_auth_access_token", accessToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    domain: IS_PRODUCTION ? ".uselexi.xyz" : "localhost",
    sameSite: "lax",
    maxAge: accessTokenMaxAge,
  });

  res.cookie("lexi_auth_refresh_token", refreshToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    domain: IS_PRODUCTION ? ".uselexi.xyz" : "localhost",
    sameSite: "lax",
    maxAge: refreshTokenMaxAge,
  });
};

export const clearAuthCookies = (res: any): void => {
  res.cookie("lexi_auth_access_token", "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    domain: IS_PRODUCTION ? ".uselexi.xyz" : "localhost",
    sameSite: "lax",
    maxAge: 0,
  });

  res.cookie("lexi_auth_refresh_token", "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    domain: IS_PRODUCTION ? ".uselexi.xyz" : "localhost",
    sameSite: "lax",
    maxAge: 0,
  });
};
