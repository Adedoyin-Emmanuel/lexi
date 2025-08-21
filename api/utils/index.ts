import {
  verifyToken,
  setAuthCookies,
  clearAuthCookies,
  generateAccessToken,
  generateRefreshToken,
} from "./jwt";
import logger from "./logger";
import redisClient from "./redis";
import response from "./response";
import passport from "./passport";
import corsOptions from "./cors-options";
import { encryptTextWithKey, decryptText } from "./encryption";
import { connectToDatabase, disconnectFromDatabase } from "./database";

export {
  logger,
  response,
  passport,
  verifyToken,
  decryptText,
  redisClient,
  corsOptions,
  setAuthCookies,
  clearAuthCookies,
  connectToDatabase,
  encryptTextWithKey,
  generateAccessToken,
  generateRefreshToken,
  disconnectFromDatabase,
};
