import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
      auth: { userId },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("pipeline:update", (data) => {
      console.log("Pipeline update:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
