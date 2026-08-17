import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import API from "../utils/axios";
import { getUserRoleLabel } from "../utils/badgeUtils";
import UserAvatar from "../components/common/UserAvatar";
import UserSignalBadge from "../components/common/UserSignalBadge";
import toast from "react-hot-toast";

const SavedPosts = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const { data } = await API.get("/posts/saved");
      setPosts(data.posts || []);
    } catch {
      toast.error("Failed to load saved posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleUnsave = async (postId) => {
    try {
      await API.post(`/posts/${postId}/save`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post removed from saved");
    } catch {
      /* ignore */
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.post(`/posts/${postId}/like`);
      fetchSaved();
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">
        <div className="h-10 w-40 skeleton mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card border border-base-300/50 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full skeleton"></div>
              <div className="h-3.5 w-28 skeleton rounded"></div>
            </div>
            <div className="h-24 skeleton rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <BookmarkCheck className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold font-heading">Saved Posts</h1>
          <p className="text-sm text-base-content/40 mt-0.5">
            {posts.length} saved post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 px-6">
          <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Bookmark className="w-10 h-10 text-base-content/20" />
          </div>
          <h3 className="text-xl font-semibold text-base-content/40 mb-2">
            No saved posts
          </h3>
          <p className="text-sm text-base-content/30 max-w-sm mx-auto">
            Save posts from your feed to read them later.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => {
            const isLiked =
              post.likes?.includes(user?._id) ||
              post.likes?.some((l) => l === user?._id || l?._id === user?._id);

            return (
              <div
                key={post._id}
                className="card bg-base-100 border border-base-300/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="card-body p-5">
                  {/* Author Row */}
                  <div className="flex items-center gap-3 mb-4">
                    <UserAvatar user={post.author} size={44} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {post.author?.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-base-content/40">
                        <span>
                          {getUserRoleLabel(post.author)}
                        </span>
                        <UserSignalBadge user={post.author} />
                        <span>·</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                    {post.type && post.type !== "general" && (
                      <span className="badge badge-sm badge-soft badge-primary text-xs font-medium px-2.5 py-1">
                        {post.type}
                      </span>
                    )}
                  </div>

                  {/* Text */}
                  {post.text && (
                    <p className="text-sm leading-relaxed mb-4 whitespace-pre-line">
                      {post.text}
                    </p>
                  )}

                  {/* Images */}
                  {post.images?.length > 0 && (
                    <div
                      className={`grid gap-2 mb-4 rounded-xl overflow-hidden ${
                        post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                      }`}
                    >
                      {post.images.map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt=""
                          className="w-full object-cover rounded-lg max-h-96"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="badge badge-sm badge-ghost text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 pt-3 border-t border-base-200">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`btn btn-ghost btn-sm gap-2 font-medium text-xs ${
                        isLiked ? "text-error" : ""
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                      />{" "}
                      {post.likes?.length || 0}
                    </button>
                    <button className="btn btn-ghost btn-sm gap-2 font-medium text-xs">
                      <MessageCircle className="w-4 h-4" />{" "}
                      {post.comments?.length || 0}
                    </button>
                    <button
                      onClick={() => handleUnsave(post._id)}
                      className="btn btn-ghost btn-sm ml-auto gap-2 font-medium text-xs text-primary"
                      title="Unsave"
                    >
                      <BookmarkCheck className="w-4 h-4" /> Saved
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
