import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  ArrowLeft,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import API from "../utils/axios";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [addingComment, setAddingComment] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data.post);
    } catch {
      toast.error("Post not found.");
      navigate("/feed", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await API.get(`/posts/${id}/comments`);
      setComments(data.comments || []);
    } catch {
      // Silently fail - comments section will show empty state
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleLike = async () => {
    if (!user) return;
    try {
      const { data } = await API.post(`/posts/${id}/like`);
      setPost((prev) => ({
        ...prev,
        likes: data.likes,
        isLiked: data.liked,
      }));
    } catch {
      toast.error("Failed to like");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const { data } = await API.post(`/posts/${id}/save`);
      setPost((prev) => ({
        ...prev,
        saves: data.saves,
        isSaved: data.saved,
      }));
      toast.success(data.saved ? "Post saved!" : "Post unsaved");
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied to clipboard!"),
      () => toast.error("Failed to copy link")
    );
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${id}`);
      toast.success("Post deleted");
      navigate("/feed", { replace: true });
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setAddingComment(true);
    try {
      const endpoint = replyTo
        ? `/comments/${replyTo}/reply`
        : `/posts/${id}/comments`;
      await API.post(endpoint, { text: commentText });
      setCommentText("");
      setReplyTo(null);
      fetchComments();
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setAddingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">
        <div className="h-8 w-32 skeleton rounded mb-6"></div>
        <div className="card border p-5 space-y-4">
          <div className="h-5 w-3/4 skeleton rounded"></div>
          <div className="h-4 w-full skeleton rounded"></div>
          <div className="h-4 w-1/2 skeleton rounded"></div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const postAuthor = post.user || post.postedBy || {};
  const isOwner = user && postAuthor._id === user._id;
  const isLiked = post.likes?.includes(user?._id) || post.isLiked;
  const isSaved = post.saves?.includes(user?._id) || post.isSaved;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm mb-4 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Post Card */}
      <div className="card bg-base-100 border border-base-300/50 shadow-sm p-5 mb-6">
        {/* Author */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/profile/${postAuthor._id}`)}
          >
            <div className="avatar placeholder">
              <div className="w-10 h-10 rounded-full bg-placeholder text-base-content/40 flex items-center justify-center">
                {postAuthor.profilePic ? (
                  <img
                    src={postAuthor.profilePic}
                    alt={postAuthor.name}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">
                    {postAuthor.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm">{postAuthor.name}</p>
              {postAuthor.role && (
                <p className="text-xs text-base-content/50 capitalize">
                  {postAuthor.role} ·{" "}
                  {postAuthor.category || postAuthor.institutionName || ""}
                </p>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-sm btn-circle">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-10">
                <li>
                  <button onClick={handleDelete} className="text-error">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {post.text}
          </p>
        </div>

        {/* Images */}
        {post.images?.length > 0 && (
          <div
            className={`grid gap-2 mb-4 ${
              post.images.length === 1
                ? "grid-cols-1"
                : post.images.length === 2
                ? "grid-cols-2"
                : "grid-cols-2"
            }`}
          >
            {post.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url || img}
                alt={`Post ${idx + 1}`}
                className="rounded-lg object-cover w-full max-h-72"
              />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-base-content/40 mb-4">
          {new Date(post.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1 border-t border-base-200 pt-3">
          <button
            onClick={handleLike}
            className={`btn btn-ghost btn-sm gap-1.5 ${
              isLiked ? "text-error" : ""
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-error" : ""}`} />
            <span className="text-xs">{post.likes?.length || 0}</span>
          </button>
          <button className="btn btn-ghost btn-sm gap-1.5">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">
              {post.commentsCount || comments.length}
            </span>
          </button>
          <button
            onClick={handleShare}
            className="btn btn-ghost btn-sm gap-1.5"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className={`btn btn-ghost btn-sm ml-auto ${
              isSaved ? "text-primary" : ""
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="card bg-base-100 border border-base-300/50 shadow-sm p-5">
        <h3 className="font-semibold text-sm mb-4">
          Comments ({comments.length})
        </h3>

        {/* Add comment */}
        <div className="flex gap-3 mb-6">
          <div className="avatar placeholder flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-placeholder text-base-content/40 flex items-center justify-center">
              <span className="text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <div className="flex-1">
            {replyTo && (
              <div className="text-xs text-base-content/50 mb-1 flex items-center gap-1">
                Replying to a comment
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-primary text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered input-sm flex-1 text-sm"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="btn btn-primary btn-sm"
                disabled={!commentText.trim() || addingComment}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-sm text-base-content/40 text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <div className="avatar placeholder flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-placeholder text-base-content/40 flex items-center justify-center">
                    {comment.user?.profilePic ? (
                      <img
                        src={comment.user.profilePic}
                        alt={comment.user.name}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold">
                        {comment.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-base-200 rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold mb-0.5">
                      {comment.user?.name}
                    </p>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-base-content/40">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        setReplyTo(comment._id);
                        setCommentText(`@${comment.user?.name} `);
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Reply
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="flex gap-2">
                          <div className="avatar placeholder flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-placeholder text-base-content/40 flex items-center justify-center">
                              <span className="text-[10px] font-bold">
                                {reply.user?.name?.charAt(0)?.toUpperCase() ||
                                  "U"}
                              </span>
                            </div>
                          </div>
                          <div className="bg-base-200 rounded-xl px-3 py-1.5">
                            <p className="text-[11px] font-semibold mb-0.5">
                              {reply.user?.name}
                            </p>
                            <p className="text-xs">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
