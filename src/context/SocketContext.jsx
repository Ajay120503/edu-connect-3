import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.DEV
  ? "/"
  : "https://edu-connect-api.onrender.com";

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef(null);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join_room", user._id);
    });

    socket.on("online_status", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (isOnline) {
          updated.add(userId);
        } else {
          updated.delete(userId);
        }
        return updated;
      });
    });

    socket.on("notification", (notification) => {
      toast(notification.message, {
        icon: notification.type === "new_message" ? "💬" : "🔔",
        duration: 4000,
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, user?._id]);

  const isUserOnline = (userId) => onlineUsers.has(userId);

  const sendMessage = (messageData) => {
    if (socketRef.current) {
      socketRef.current.emit("send_message", messageData);
    }
  };

  const emitTyping = (conversationId, userId) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", { conversationId, userId });
    }
  };

  const emitStopTyping = (conversationId, userId) => {
    if (socketRef.current) {
      socketRef.current.emit("stop_typing", { conversationId, userId });
    }
  };

  const joinConversation = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit("join_conversation", conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit("leave_conversation", conversationId);
    }
  };

  const markMessageRead = (messageId, conversationId, userId) => {
    if (socketRef.current) {
      socketRef.current.emit("mark_read", {
        messageId,
        conversationId,
        userId,
      });
    }
  };

  const value = {
    socket: socketRef,
    onlineUsers,
    isUserOnline,
    sendMessage,
    emitTyping,
    emitStopTyping,
    joinConversation,
    leaveConversation,
    markMessageRead,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
