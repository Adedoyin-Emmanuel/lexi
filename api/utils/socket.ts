import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";

import logger from "./logger";
import { SOCKET_EVENTS } from "../types/socket";
import { IS_PRODUCTION } from "../constants/app";
import chatHandler from "../features/chat/handler";
import { IIncomingChatPayload } from "./../features/chat/types";

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

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE_JOIN_ROOM, (contractId: string) => {
      socket.join(contractId);

      logger(`User joined room ${contractId}`);
    });

    socket.on(
      SOCKET_EVENTS.CHAT_MESSAGE_USER_MESSAGE,
      async (payload: IIncomingChatPayload) => {
        logger(`Received chat message from user ${payload.contractId}`);

        await chatHandler.handleIncomingChat(payload);
      }
    );
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
