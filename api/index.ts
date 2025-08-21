import "./types/types";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { Server } from "http";
import "express-async-errors";
import EventEmitter from "events";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import express, { Application } from "express";

import baseRouter from "./features/base/route";
import authRouter from "./features/auth/route";
import userRouter from "./features/user/route";

import {
  logger,
  passport,
  corsOptions,
  redisClient,
  connectToDatabase,
  disconnectFromDatabase,
} from "./utils";
import { useErrorHandler, useNotFound } from "./middlewares/";
import {
  IS_PRODUCTION,
  PORT,
  SESSION_SECRET,
  MONGODB_URL,
} from "./constants/app";

dotenv.config();

class ApiServer {
  private app: Application;
  private apiVersion: string;
  private maxEventListeners: number;
  private server: Server | null = null;

  constructor(apiVersion: string = "v1", maxEventListeners: number = 50) {
    this.app = express();
    this.apiVersion = apiVersion;
    this.maxEventListeners = maxEventListeners;
    EventEmitter.defaultMaxListeners = this.maxEventListeners;
  }

  private setupMiddlewares(): void {
    this.app.use(cors(corsOptions));
    this.app.use(bodyParser.json({ limit: "1mb" }));
    this.app.use(morgan("dev"));
    this.app.use(helmet());

    this.app.use(
      session({
        name: "lexi.sid",
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: MONGODB_URL,
          ttl: 14 * 24 * 60 * 60,
          autoRemove: "native",
          touchAfter: 24 * 3600,
        }),
        cookie: {
          secure: IS_PRODUCTION,
          httpOnly: true,
          maxAge: 14 * 24 * 60 * 60 * 1000,
          sameSite: IS_PRODUCTION ? "strict" : "lax",
        },
        unset: "destroy",
      })
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private setupRoutes(): void {
    const apiPath = `/${this.apiVersion}`;

    this.app.use(`${apiPath}`, baseRouter);
    this.app.use(`${apiPath}/auth`, authRouter);
    this.app.use(`${apiPath}/user`, userRouter);
  }

  private setupErrorHandlers(): void {
    this.app.use(useNotFound);
    this.app.use(useErrorHandler);
  }

  public async connectDatabase(): Promise<void> {
    await connectToDatabase();
  }

  public async connectRedis(): Promise<void> {
    await redisClient.connect();
  }

  public async disconnectDatabase(): Promise<void> {
    await disconnectFromDatabase();
  }

  public async disconnectRedis(): Promise<void> {
    redisClient.destroy();
  }

  public async start(port: number = Number(PORT)): Promise<void> {
    try {
      this.setupMiddlewares();
      this.setupRoutes();
      this.setupErrorHandlers();

      await this.connectDatabase();
      await this.connectRedis();

      this.server = this.app.listen(port, () => {
        logger(`Server is running on PORT ${port} 🚀`);
      });

      this.setupGracefulShutdown();
    } catch (error) {
      logger("Failed to start server:", error);
      throw error;
    }
  }

  private setupGracefulShutdown(): void {
    const shutdownGracefully = async (signal: string): Promise<void> => {
      logger(`Received ${signal}. Starting graceful shutdown...`);

      if (this.server) {
        this.server.close(() => {
          logger("HTTP server closed");
        });
      }

      try {
        await this.disconnectDatabase();
        await this.disconnectRedis();
        logger("All connections closed successfully");
        process.exit(0);
      } catch (error) {
        logger("Error during graceful shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => shutdownGracefully("SIGTERM"));
    process.on("SIGINT", () => shutdownGracefully("SIGINT"));
  }
}

const server = new ApiServer();

server.start().catch((err) => {
  logger("Failed to start server:", err);
  process.exit(1);
});
