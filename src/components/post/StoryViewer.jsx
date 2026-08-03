import { useState, useEffect, useCallback } from "react";
import { X, Eye } from "lucide-react";
import API from "../../utils/axios";
import UserAvatar from "../common/UserAvatar";

const StoryViewer = ({ group, onClose, onViewed }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const stories = group.stories || [];
  const currentStory = stories[currentIndex];

  const markAsViewed = useCallback(
    async (storyId) => {
      try {
        await API.post(`/stories/${storyId}/view`);
        if (onViewed) onViewed();
      } catch {
        /* silently fail */
      }
    },
    [onViewed]
  );

  useEffect(() => {
    if (currentStory) {
      markAsViewed(currentStory._id);
    }
  }, [currentStory, markAsViewed]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (!currentStory) return;
    const timer = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onClose();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, stories.length, onClose, currentStory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0)
        setCurrentIndex((prev) => prev - 1);
      if (e.key === "ArrowRight" && currentIndex < stories.length - 1)
        setCurrentIndex((prev) => prev + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 btn btn-circle btn-ghost text-white"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Progress bars */}
      <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
        {stories.map((_, idx) => (
          <div
            key={idx}
            className="h-0.5 rounded-full bg-white/30 flex-1 overflow-hidden"
          >
            <div
              className={`h-full bg-white transition-all duration-100 ${
                idx < currentIndex
                  ? "w-full"
                  : idx === currentIndex
                  ? "animate-[storyProgress_5s_linear]"
                  : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Author info */}
      <div className="absolute top-8 left-4 flex items-center gap-2 z-10">
        <UserAvatar user={group.author} size={32} />
        <div>
          <p className="text-white text-sm font-medium">{group.author?.name}</p>
          <p className="text-white/60 text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" /> {currentStory.viewers?.length || 0}{" "}
            views
          </p>
        </div>
      </div>

      {/* Navigation areas */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-0 bottom-0 w-1/4 z-10"
      />
      <button
        onClick={handleNext}
        className="absolute right-0 top-0 bottom-0 w-1/4 z-10"
      />

      {/* Story content */}
      <div className="w-full h-full flex items-center justify-center p-4">
        {currentStory.image?.url ? (
          <img
            src={currentStory.image.url}
            alt=""
            className="max-h-[80vh] max-w-full object-contain rounded-lg"
          />
        ) : currentStory.text ? (
          <div className="text-white text-center max-w-md">
            <p className="text-xl">{currentStory.text}</p>
          </div>
        ) : null}
      </div>

      {/* Text overlay at bottom */}
      {currentStory.text && (
        <div className="absolute bottom-8 left-0 right-0 text-center px-8">
          <p className="text-white text-lg font-medium drop-shadow-lg">
            {currentStory.text}
          </p>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
