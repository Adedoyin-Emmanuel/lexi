import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId || userId.trim() === "") {
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
      auth: { userId },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      /** Join our room immediately after connecting */
      socket.emit("joinRoom", userId);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
