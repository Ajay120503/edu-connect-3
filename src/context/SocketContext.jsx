import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://edu-connect-fwoo.onrender.com";

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const socketRef = useRef(null);
  const { user, isAuthenticated } = useAuthStore();

  // Fetch initial counts on auth change
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    const fetchInitialCounts = async () => {
      try {
        const API = (await import("../utils/axios")).default;
        const [notifRes, convRes] = await Promise.all([
          API.get("/notifications?limit=1"),
          API.get("/chat/conversations"),
        ]);
        setNotificationCount(notifRes.data.unreadCount || 0);
        const conversations = convRes.data.conversations || [];
        const totalUnread = conversations.reduce((sum, conv) => {
          const userId = user._id;
          const count =
            conv.unreadCounts?.get?.(userId) ||
            conv.unreadCounts?.[userId] ||
            0;
          return sum + count;
        }, 0);
        setMessageCount(totalUnread);
      } catch {
        // silent
      }
    };
    fetchInitialCounts();
  }, [isAuthenticated, user?._id]);

  // Socket connection
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_room", user._id);
    });

    socket.on("online_status", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (isOnline) updated.add(userId);
        else updated.delete(userId);
        return updated;
      });
    });

    // Global notification listener - updates badge count + shows clickable toast
    socket.on("notification", (notification) => {
      // Increment notification badge
      setNotificationCount((prev) => prev + 1);

      // Show clickable toast that navigates to the exact link
      const iconMap = {
        new_message: "💬",
        post_like: "❤️",
        post_comment: "💬",
        comment_like: "👍",
        comment_reply: "↩️",
        new_follower: "👤",
        job_applied: "📋",
        application_status: "📄",
      };
      toast(
        (t) => (
          <div
            onClick={() => {
              toast.dismiss(t.id);
              if (notification.link) {
                window.location.href = notification.link;
              }
            }}
            style={{ cursor: notification.link ? "pointer" : "default" }}
          >
            {notification.message}
          </div>
        ),
        {
          icon: iconMap[notification.type] || "🔔",
          duration: 5000,
        }
      );
    });

    // Real-time message listener - updates message badge
    socket.on("receive_message", (message) => {
      const senderId =
        typeof message.sender === "object"
          ? message.sender._id
          : message.sender;
      // Only increment for messages from others
      if (senderId !== user._id) {
        setMessageCount((prev) => prev + 1);
      }
    });

    socket.on("disconnect", () => {
      // silently
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, user?._id]);

  const isUserOnline = (userId) => onlineUsers.has(userId);

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

  const resetNotificationCount = () => setNotificationCount(0);
  const resetMessageCount = () => setMessageCount(0);

  const value = {
    socket: socketRef,
    onlineUsers,
    isUserOnline,
    notificationCount,
    messageCount,
    setNotificationCount,
    setMessageCount,
    resetNotificationCount,
    resetMessageCount,
    emitTyping,
    emitStopTyping,
    joinConversation,
    leaveConversation,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
