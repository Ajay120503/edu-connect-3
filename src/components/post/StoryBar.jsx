import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import API from "../../utils/axios";
import useAuthStore from "../../store/authStore";
import StoryViewer from "./StoryViewer";

const CAN_POST_STORY = ["teacher", "professor", "hod", "principal"];

const StoryBar = ({ onAddStory }) => {
  const { user } = useAuthStore();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingStory, setViewingStory] = useState(null);

  const fetchStories = async () => {
    try {
      const { data } = await API.get("/stories");
      setStories(data.stories || []);
    } catch {
      /* silently fail */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const canPost = user && CAN_POST_STORY.includes(user.role);

  if (loading) {
    return (
      <div className="flex gap-3 mb-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-16 h-16 rounded-full skeleton flex-shrink-0"
          ></div>
        ))}
      </div>
    );
  }

  if (!canPost && stories.length === 0) return null;

  return (
    <>
      <div className="flex gap-3 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        {/* Add story button for institution members */}
        {canPost && (
          <button
            onClick={onAddStory}
            className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-base-200 border-2 border-dashed border-base-300 flex items-center justify-center hover:border-primary transition-colors">
              <Plus className="w-5 h-5 text-base-content/40" />
            </div>
            <span className="text-[10px] text-base-content/50">Your Story</span>
          </button>
        )}

        {stories.map((group) => {
          const unseenStories = group.stories.filter(
            (s) => !s.viewers?.includes(user?._id)
          );
          const hasUnseen = unseenStories.length > 0;

          return (
            <button
              key={group.author._id}
              onClick={() => setViewingStory(group)}
              className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  hasUnseen ? "bg-primary" : "bg-base-300"
                }`}
              >
                <div className="w-full h-full rounded-full bg-base-100 overflow-hidden border-2 border-base-100 flex items-center justify-center">
                  {group.author?.institutionPic?.url ? (
                    <img
                      src={group.author.institutionPic.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : group.author?.profilePic?.url ? (
                    <img
                      src={group.author.profilePic.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-base-content/40">
                      {group.author?.name?.charAt(0) || "?"}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-base-content/50 truncate max-w-[64px]">
                {group.author?.institutionName || group.author?.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Story Viewer Modal */}
      {viewingStory && (
        <StoryViewer
          group={viewingStory}
          onClose={() => setViewingStory(null)}
          onViewed={fetchStories}
        />
      )}
    </>
  );
};

export default StoryBar;
