import "express-session";

import "express-session";
import { Types } from "mongoose";

declare module "express-session" {
  interface SessionData {
    redirectUrl: string;
    user: {
      id: string;
      name: string;
      emails: any[];
      provider: string;
      accessToken: string;
      avatar: string | null;
    };
  }
}

export interface JwtUser {
  name: string;
  iat: number;
  exp: number;
  email: string;
  avatar: string;
  userId: string | Types.ObjectId;
}

declare module "express" {
  interface Request {
    user: JwtUser;
  }
}
