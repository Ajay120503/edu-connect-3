import { useState } from "react";
import API from "../../utils/axios";

const ALLOWED_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

const MessageReaction = ({ messageId, reactions, isOwnMessage }) => {
  const [showPicker, setShowPicker] = useState(false);

  const grouped = (reactions || []).map((r) => ({
    emoji: r.emoji,
    count: r.reactedBy?.length || 0,
  }));

  const handleReact = async (emoji) => {
    try {
      await API.post(`/chat/messages/${messageId}/react`, { emoji });
      setShowPicker(false);
    } catch {
      /* silently fail */
    }
  };

  return (
    <div className="relative">
      {/* Reaction pills below message */}
      {grouped.length > 0 && (
        <div className="flex gap-1 mt-0.5 flex-wrap">
          {grouped.map(({ emoji, count }) => (
            <button
              key={emoji}
              className="badge badge-ghost badge-xs text-xs gap-0.5 cursor-pointer hover:badge-primary"
              onClick={() => handleReact(emoji)}
            >
              {emoji} {count}
            </button>
          ))}
          <button
            className="badge badge-ghost badge-xs text-xs cursor-pointer hover:badge-primary"
            onClick={() => setShowPicker(!showPicker)}
          >
            +
          </button>
        </div>
      )}

      {/* Show + button even without reactions */}
      {grouped.length === 0 && (
        <button
          className="badge badge-ghost badge-xs text-xs cursor-pointer hover:badge-primary opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setShowPicker(!showPicker)}
        >
          +
        </button>
      )}

      {/* Reaction picker */}
      {showPicker && (
        <div className="absolute bottom-full mb-1 bg-base-100 shadow-lg rounded-full px-2 py-1 flex gap-1 border border-base-300 z-10">
          {ALLOWED_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className="text-lg hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageReaction;
