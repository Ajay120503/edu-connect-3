import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import useAuthStore from "../store/authStore";
import API from "../utils/axios";

const useUnreadCount = () => {
  const { socket } = useSocket();
  const { user } = useAuthStore();
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  const fetchCounts = async () => {
    if (!user?._id) return;
    try {
      const [notifRes, chatRes] = await Promise.all([
        API.get("/notifications?limit=1"),
        API.get("/chat/conversations"),
      ]);
      setNotificationCount(notifRes.data.unreadCount || 0);
      const conversations = chatRes.data.conversations || [];
      const totalUnread = conversations.reduce((sum, conv) => {
        const userId = user._id;
        const userUnread =
          conv.unreadCounts?.get?.(userId) ||
          conv.unreadCounts?.[userId] ||
          0;
        return sum + userUnread;
      }, 0);
      setMessageCount(totalUnread);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [user?._id]);

  // Listen for real-time updates via socket
  useEffect(() => {
    if (!socket?.current) return;

    const handleNotification = () => {
      setNotificationCount((prev) => prev + 1);
    };

    const handleMessage = (message) => {
      // Only increment for messages from other users, not self-sent
      if (message.sender?._id !== user?._id && message.sender !== user?._id) {
        setMessageCount((prev) => prev + 1);
      }
    };

    socket.current.on("notification", handleNotification);
    socket.current.on("receive_message", handleMessage);

    return () => {
      socket.current?.off("notification", handleNotification);
      socket.current?.off("receive_message", handleMessage);
    };
  }, [socket?.current]);

  return { notificationCount, messageCount, refetch: fetchCounts };
};

export default useUnreadCount;
