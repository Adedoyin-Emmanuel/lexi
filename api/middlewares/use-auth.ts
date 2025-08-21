import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { JwtUser } from "./../types/types";
import { response, logger } from "./../utils";
import { JWT_SECRET } from "./../constants/app";

const useAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const authCookie = req.cookies["lexi_auth_access_token"];
  const userAgent = req.headers["user-agent"];

  if (!authHeader && !authCookie) {
    logger.info(
      `Missing authorization header or cookie from ${req.ip} with user agent ${userAgent}`
    );
    return response(res, 401, "Unauthorized - Missing authentication token");
  }

  const token = authHeader?.split(" ")[1] || authCookie;

  if (!token) {
    logger(`Invalid request from ${req.ip} with user agent ${userAgent}`);
    return response(
      res,
      401,
      "Forbidden - Invalid or expired authentication token"
    );
  }

  let validToken;
  try {
    validToken = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger(
      `JWT verification failed from ${req.ip} with user agent ${userAgent}: ${error.message}`
    );
    return response(
      res,
      401,
      "Forbidden - Invalid or expired authentication token"
    );
  }

  if (!validToken) {
    logger(`Invalid token from ${req.ip} with user agent ${userAgent}`);
    return response(
      res,
      401,
      "Forbidden - Invalid or expired authentication token"
    );
  }

  req.user = validToken as JwtUser;

  next();
};

export default useAuth;
