import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Send, ImagePlus, ArrowLeft, User, MessageCircle } from "lucide-react";
import useAuthStore from "../store/authStore";
import { useSocket } from "../context/SocketContext";
import API from "../utils/axios";
import toast from "react-hot-toast";

const Chat = () => {
  const { id: selectedUserId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const {
    socket,
    onlineUsers,
    isUserOnline,
    emitTyping,
    emitStopTyping,
    joinConversation,
    leaveConversation,
  } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState({});
  const messagesEndRef = useRef(null);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await API.get("/chat/conversations");
        setConversations(data.conversations || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Start conversation with selected user
  useEffect(() => {
    if (selectedUserId && user) {
      const startConversation = async () => {
        try {
          const { data } = await API.post("/chat/conversations", {
            participantId: selectedUserId,
          });
          setActiveConversation(data.conversation);
          joinConversation(data.conversation._id);
        } catch (err) {
          toast.error("Could not start conversation");
        }
      };
      startConversation();
    }
  }, [selectedUserId, user]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!activeConversation) return;
    const fetchMessages = async () => {
      try {
        const { data } = await API.get(
          `/chat/conversations/${activeConversation._id}/messages`
        );
        setMessages(data.messages || []);
      } catch {
        /* ignore */
      }
    };
    fetchMessages();
    joinConversation(activeConversation._id);

    return () => {
      leaveConversation(activeConversation._id);
    };
  }, [activeConversation?._id]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket?.current) return;

    const handleReceiveMessage = (message) => {
      if (
        activeConversation &&
        message.conversation === activeConversation._id
      ) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
      // Refresh conversation list
      API.get("/chat/conversations").then(({ data }) =>
        setConversations(data.conversations || [])
      );
    };

    const handleTyping = ({ conversationId, userId }) => {
      if (conversationId === activeConversation?._id) {
        setTypingUsers((prev) => ({ ...prev, [userId]: true }));
      }
    };

    const handleStopTyping = ({ conversationId, userId }) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: false }));
    };

    socket.current.on("receive_message", handleReceiveMessage);
    socket.current.on("is_typing", handleTyping);
    socket.current.on("stopped_typing", handleStopTyping);

    return () => {
      socket.current?.off("receive_message", handleReceiveMessage);
      socket.current?.off("is_typing", handleTyping);
      socket.current?.off("stopped_typing", handleStopTyping);
    };
  }, [socket?.current, activeConversation?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    try {
      const { data } = await API.post("/chat/messages", {
        conversationId: activeConversation._id,
        content: messageText.trim(),
        type: "text",
      });
      setMessages([...messages, data.message]);
      setMessageText("");
      emitStopTyping(activeConversation._id, user._id);
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleTyping = () => {
    if (!activeConversation) return;
    emitTyping(activeConversation._id, user._id);
    setTimeout(() => emitStopTyping(activeConversation._id, user._id), 2000);
  };

  const getOtherParticipant = (conv) => {
    return (
      conv.participants?.find((p) => p._id !== user?._id) ||
      conv.otherParticipant
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Conversation List */}
      <div
        className={`${
          activeConversation ? "hidden md:flex" : "flex"
        } md:w-80 w-full flex-col border-r border-base-300`}
      >
        <div className="p-4 border-b border-base-300">
          <h1 className="text-xl font-bold font-heading">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 skeleton rounded"></div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center p-8 text-base-content/50">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-base-200 transition-colors ${
                    activeConversation?._id === conv._id ? "bg-base-200" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/20 overflow-hidden">
                      {other?.profilePic?.url ? (
                        <img
                          src={other.profilePic.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                          {other?.name?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                    {isUserOnline(other?._id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">
                        {other?.name || "Unknown"}
                      </p>
                      {conv.lastMessageTime && (
                        <span className="text-xs text-base-content/40">
                          {new Date(conv.lastMessageTime).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-base-content/50 truncate">
                      {conv.lastMessage || "Start a conversation"}
                    </p>
                  </div>
                  {(conv.unreadCounts?.[user?._id] || 0) > 0 && (
                    <span className="badge badge-primary badge-sm">
                      {conv.unreadCounts[user._id]}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b border-base-300 bg-base-100">
            <button
              className="btn btn-ghost btn-circle btn-sm md:hidden"
              onClick={() => setActiveConversation(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link
              to={`/profile/${getOtherParticipant(activeConversation)?._id}`}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden">
                {getOtherParticipant(activeConversation)?.profilePic?.url ? (
                  <img
                    src={getOtherParticipant(activeConversation).profilePic.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                    {getOtherParticipant(activeConversation)?.name?.charAt(0) ||
                      "?"}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {getOtherParticipant(activeConversation)?.name}
                </p>
                <p className="text-xs text-base-content/50">
                  {isUserOnline(
                    getOtherParticipant(activeConversation)?._id
                  ) ? (
                    <span className="text-success">Online</span>
                  ) : (
                    "Offline"
                  )}
                </p>
              </div>
            </Link>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-base-content/50 mt-10">
                No messages yet. Say hello!
              </p>
            ) : (
              messages.map((msg) => {
                const isMine =
                  msg.sender?._id === user._id || msg.sender === user._id;
                return (
                  <div
                    key={msg._id}
                    className={`chat ${isMine ? "chat-end" : "chat-start"}`}
                  >
                    <div className="chat-image avatar">
                      <div className="w-8 rounded-full">
                        {msg.sender?.profilePic?.url ? (
                          <img src={msg.sender.profilePic.url} alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary text-xs font-bold rounded-full">
                            {msg.sender?.name?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="chat-header text-xs opacity-50 mb-0.5">
                      {msg.sender?.name || "User"}
                      <time className="ml-2 text-[10px]">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    <div
                      className={`chat-bubble text-sm ${
                        isMine ? "chat-bubble-primary" : ""
                      }`}
                    >
                      {msg.type === "text" && msg.content}
                      {msg.type === "image" && (
                        <img
                          src={msg.fileUrl}
                          alt=""
                          className="max-w-xs rounded-lg"
                        />
                      )}
                      {msg.type === "file" && (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          className="underline"
                        >
                          {msg.fileName || "Download File"}
                        </a>
                      )}
                    </div>
                    {isMine && (
                      <div className="chat-footer text-[10px] opacity-50 mt-0.5">
                        {msg.readBy?.length > 1 ? "✓✓ Read" : "✓ Sent"}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            {/* Typing indicator */}
            {Object.entries(typingUsers).some(
              ([uid, isTyping]) => isTyping && uid !== user._id
            ) && (
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full bg-base-300"></div>
                </div>
                <div className="chat-bubble bg-base-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-base-300 bg-base-100 flex gap-2"
          >
            <button type="button" className="btn btn-ghost btn-circle btn-sm">
              <ImagePlus className="w-5 h-5" />
            </button>
            <input
              type="text"
              className="input input-bordered flex-1 rounded-full"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-circle btn-sm"
              disabled={!messageText.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-base-content/40">
          <div className="text-center">
            <MessageCircle className="w-20 h-20 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Select a conversation</p>
            <p className="text-sm">or search for users to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
