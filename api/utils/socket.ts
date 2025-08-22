import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";

import logger from "./logger";
import { IS_PRODUCTION } from "../constants/app";

let io: IOServer;

export const initSocket = (server: HttpServer): IOServer => {
  io = new IOServer(server, {
    cors: {
      origin: IS_PRODUCTION ? "https://uselexi.xyz" : "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    logger(`⚡: New client connected ${socket.id}`);

    socket.on("joinRoom", (userId: string) => {
      socket.join(userId);

      logger(`User ${userId} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      logger(`Client disconnected ${socket.id}`);
    });
  });

  return io;
};

export const getSocket = (): IOServer => {
  if (!io) {
    throw new Error(
      "Socket.io has not been initialized! Call initSocket first."
    );
  }
  return io;
};
