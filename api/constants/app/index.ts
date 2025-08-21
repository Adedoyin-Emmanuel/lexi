import dotenv from "dotenv";

dotenv.config();

export const GLOBAL_RATE_LIMIT_WINDOW_MS = 60 * 1000;
export const GLOBAL_REQUEST_PER_MINUTE = 100;
export const ALLOWED_FILE_UPLOAD_EXTENSIONS = ["png", "jpeg", "jpg"];
export const MAX_FILE_SIZE = 1024 * 1024 * 5;
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const MORGAN_CONFIG = IS_PRODUCTION
  ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  : "dev";

export const PORT = process.env.PORT || 2800;
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/lexi";
export const SESSION_SECRET =
  process.env.SESSION_SECRET || "your-secret-key-change-in-production";

export const GOOGLE_CALLBACK_URL = `${
  IS_PRODUCTION
    ? `https://api.uselexi.xyz/v1/auth/google/callback`
    : "http://localhost:2800/v1/auth/google/callback"
}`;
