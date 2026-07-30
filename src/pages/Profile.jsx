import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  MessageCircle,
  MapPin,
  Mail,
  Edit3,
  Grid3X3,
  Briefcase,
  Heart,
  MessageCircle as CommentIcon,
  Bookmark,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import API from "../utils/axios";
import toast from "react-hot-toast";
import StrengthMeter from "../components/profile/StrengthMeter";
import VerifiedBadge from "../components/common/VerifiedBadge";
import AcademicTimeline from "../components/profile/AcademicTimeline";
import EndorsementTag from "../components/profile/EndorsementTag";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState([]);
  const [userJobs, setUserJobs] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);

  const isOwnProfile = currentUser?._id === id;

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await API.get(`/users/${id}`);
      setProfile(data.user);
    } catch {
      toast.error("User not found");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchUserPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const { data } = await API.get(`/users/${id}/posts`);
      setUserPosts(data.posts || []);
    } catch {
      /* silently fail */
    } finally {
      setPostsLoading(false);
    }
  }, [id]);

  const fetchUserJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const { data } = await API.get(`/users/${id}/jobs`);
      setUserJobs(data.jobs || []);
    } catch {
      /* silently fail */
    } finally {
      setJobsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
    fetchUserJobs();
  }, [id, fetchProfile, fetchUserPosts, fetchUserJobs]);

  const handleFollow = async () => {
    try {
      const { data } = await API.post(`/users/${id}/follow`);
      setProfile((prev) => ({
        ...prev,
        followers: data.isFollowing
          ? [...(prev.followers || []), currentUser._id]
          : (prev.followers || []).filter((f) => f !== currentUser._id),
        followersCount: data.followersCount,
      }));
      toast.success(data.isFollowing ? "Following!" : "Unfollowed");
    } catch {
      toast.error("Failed to update follow status");
    }
  };

  const handleLikePost = async (postId, idx) => {
    try {
      const { data } = await API.post(`/posts/${postId}/like`);
      setUserPosts((prev) =>
        prev.map((p, i) =>
          i === idx
            ? {
                ...p,
                likes: data.likesCount !== undefined ? [] : p.likes,
                isLiked: data.isLiked,
                likesCount: data.likesCount,
                _likesCount: data.likesCount,
              }
            : p
        )
      );
    } catch {
      toast.error("Failed to like post");
    }
  };

  const handleSavePost = async (postId, idx) => {
    try {
      const { data } = await API.post(`/posts/${postId}/save`);
      setUserPosts((prev) =>
        prev.map((p, i) =>
          i === idx ? { ...p, saves: data.saves, isSaved: data.saved } : p
        )
      );
      toast.success(data.saved ? "Post saved!" : "Post unsaved");
    } catch {
      toast.error("Failed to save post");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setUserPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job posting?")) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      setUserJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success("Job deleted");
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const timeAgo = useCallback((dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full skeleton shrink-0"></div>
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="h-6 w-40 skeleton rounded mx-auto md:mx-0"></div>
            <div className="h-4 w-60 skeleton rounded mx-auto md:mx-0"></div>
            <div className="h-4 w-32 skeleton rounded mx-auto md:mx-0"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-20">
        <h2 className="text-xl font-semibold text-base-content/40">
          User not found
        </h2>
      </div>
    );
  }

  const isFollowing = profile.followers?.includes(currentUser?._id);
  const followerCount = profile.followers?.length || 0;
  const followingCount = profile.following?.length || 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
      {/* ============ PROFILE HEADER ============ */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-10 mb-8">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-placeholder overflow-hidden ring-2 ring-base-300/50 shadow-md">
            {profile.profilePic?.url ? (
              <img
                src={profile.profilePic.url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base-content/40 text-3xl md:text-5xl font-bold">
                {profile.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
            <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2 flex-wrap">
              {profile.name}
              <VerifiedBadge verifiedStatus={profile.verifiedStatus} />
            </h1>

            {/* Action buttons */}
            {!isOwnProfile ? (
              <div className="flex gap-2 justify-center md:justify-start">
                <button
                  onClick={handleFollow}
                  className={`btn btn-sm gap-1.5 font-medium ${
                    isFollowing
                      ? "btn-outline"
                      : "btn-primary shadow-md shadow-primary/20"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <Link
                  to={`/chat/${profile._id}`}
                  className="btn btn-outline btn-sm gap-1.5 font-medium"
                >
                  <MessageCircle className="w-4 h-4" /> Message
                </Link>
              </div>
            ) : (
              <Link
                to="/edit-profile"
                className="btn btn-outline btn-sm gap-1.5 font-medium"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 mb-3">
            <div className="text-center md:text-left">
              <span className="font-bold">{userPosts.length}</span>
              <span className="text-sm text-base-content/50 ml-1">posts</span>
            </div>
            <button
              onClick={() => {}}
              className="text-center md:text-left cursor-default"
            >
              <span className="font-bold">{followerCount}</span>
              <span className="text-sm text-base-content/50 ml-1">
                followers
              </span>
            </button>
            <div className="text-center md:text-left">
              <span className="font-bold">{followingCount}</span>
              <span className="text-sm text-base-content/50 ml-1">
                following
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mb-2">
            <span className="badge badge-sm badge-soft badge-primary font-medium capitalize">
              {profile.role}
            </span>
            {profile.institutionName && (
              <span className="badge badge-sm badge-ghost font-medium">
                {profile.institutionName}
              </span>
            )}
            {profile.category && (
              <span className="badge badge-sm badge-outline font-medium">
                {profile.category}
              </span>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-base-content/70 leading-relaxed max-w-lg">
              {profile.bio}
            </p>
          )}

          {/* Skills with Endorsements */}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-2">
              {profile.skills.map((skill, idx) => (
                <EndorsementTag key={idx} skill={skill} profileId={id} />
              ))}
            </div>
          )}

          {/* Location / Contact */}
          {(profile.city || profile.email) && (
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2 text-xs text-base-content/40">
              {profile.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {profile.city}
                  {profile.state ? `, ${profile.state}` : ""}
                </span>
              )}
              {profile.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {profile.email}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Strength Meter (own profile only) */}
      {isOwnProfile && <StrengthMeter user={profile} />}

      {/* Academic Timeline */}
      <AcademicTimeline timeline={profile.timeline} isOwner={isOwnProfile} />

      {/* ============ TAB BAR ============ */}
      <div className="flex border-t border-base-300 mb-0">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-t-2 -mt-[2px] transition-colors ${
            activeTab === "posts"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/40 hover:text-base-content/60"
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
          <span className="hidden sm:inline">POSTS</span>
        </button>
        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-t-2 -mt-[2px] transition-colors ${
            activeTab === "jobs"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/40 hover:text-base-content/60"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span className="hidden sm:inline">JOBS</span>
        </button>
      </div>

      {/* ============ POSTS TAB (Instagram-style grid) ============ */}
      {activeTab === "posts" && (
        <div>
          {postsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-base-200 skeleton rounded-sm"
                ></div>
              ))}
            </div>
          ) : userPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
                <Grid3X3 className="w-8 h-8 text-base-content/20" />
              </div>
              <h3 className="text-lg font-semibold text-base-content/40 mb-1">
                No Posts Yet
              </h3>
              <p className="text-sm text-base-content/30">
                {isOwnProfile
                  ? "Share your first post with the community!"
                  : "This user hasn't posted anything yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
              {userPosts.map((post, idx) => {
                const hasImages = post.images && post.images.length > 0;
                const firstImage = hasImages
                  ? post.images[0]?.url || post.images[0]
                  : null;
                const isPostLiked =
                  post.isLiked ??
                  post.likes?.some(
                    (l) => l === currentUser?._id || l?._id === currentUser?._id
                  );
                const isPostSaved =
                  post.isSaved ??
                  post.saves?.some(
                    (s) => s === currentUser?._id || s?._id === currentUser?._id
                  );
                const likesCount =
                  post._likesCount ??
                  post.likesCount ??
                  post.likes?.length ??
                  0;
                const commentsCount =
                  post.commentsCount ?? post.comments?.length ?? 0;

                return (
                  <div key={post._id} className="group relative cursor-pointer">
                    {/* Clickable overlay to navigate to post detail */}
                    <div
                      onClick={() => navigate(`/post/${post._id}`)}
                      className="aspect-square bg-base-200 overflow-hidden rounded-sm"
                    >
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
                          <p className="text-xs text-base-content/50 text-center line-clamp-3">
                            {post.text || "No caption"}
                          </p>
                        </div>
                      )}

                      {/* Hover overlay (desktop only) */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center gap-6 text-white">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Heart
                            className={`w-5 h-5 ${
                              isPostLiked ? "fill-white" : ""
                            }`}
                          />
                          {likesCount}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold">
                          <CommentIcon className="w-5 h-5" />
                          {commentsCount}
                        </span>
                      </div>
                    </div>

                    {/* Post actions bar (visible on mobile, shown below grid item) */}
                    <div className="md:hidden flex items-center gap-3 px-1 py-1.5 text-xs text-base-content/50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikePost(post._id, idx);
                        }}
                        className={`flex items-center gap-1 ${
                          isPostLiked ? "text-error" : ""
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isPostLiked ? "fill-error" : ""
                          }`}
                        />
                        {likesCount}
                      </button>
                      <span className="flex items-center gap-1">
                        <CommentIcon className="w-3.5 h-3.5" />
                        {commentsCount}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSavePost(post._id, idx);
                        }}
                        className={`ml-auto ${
                          isPostSaved ? "text-primary" : ""
                        }`}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            isPostSaved ? "fill-primary" : ""
                          }`}
                        />
                      </button>
                      {isOwnProfile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePost(post._id);
                          }}
                          className="text-error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Desktop-only: quick action dropdown on hover */}
                    {isOwnProfile && (
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                        <div className="dropdown dropdown-end">
                          <button
                            tabIndex={0}
                            className="btn btn-xs btn-circle btn-ghost bg-black/30 text-white border-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-36 z-10 text-xs"
                          >
                            <li>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePost(post._id);
                                }}
                                className="text-error"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============ JOBS TAB ============ */}
      {activeTab === "jobs" && (
        <div>
          {jobsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-base-200 skeleton rounded-lg"
                ></div>
              ))}
            </div>
          ) : userJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-base-content/20" />
              </div>
              <h3 className="text-lg font-semibold text-base-content/40 mb-1">
                No Job Postings
              </h3>
              <p className="text-sm text-base-content/30">
                {isOwnProfile
                  ? "Post your first job opening!"
                  : "This user hasn't posted any jobs yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userJobs.map((job) => (
                <div
                  key={job._id}
                  className="card bg-base-100 border border-base-300/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/jobs/${job._id}`)}
                >
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Institution Logo */}
                        <div className="w-10 h-10 rounded-lg bg-placeholder overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {job.institutionLogo?.url ? (
                            <img
                              src={job.institutionLogo.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Briefcase className="w-5 h-5 text-base-content/40" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm truncate">
                            {job.title}
                          </h4>
                          <p className="text-xs text-base-content/50 truncate">
                            {job.institutionName}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {job.isPaid ? (
                              <span className="badge badge-xs badge-success badge-soft">
                                Paid
                                {job.stipend > 0 && ` · ₹${job.stipend}`}
                              </span>
                            ) : (
                              <span className="badge badge-xs badge-ghost">
                                Volunteer
                              </span>
                            )}
                            <span className="badge badge-xs badge-outline capitalize">
                              {job.location}
                            </span>
                            <span className="badge badge-xs badge-outline capitalize">
                              {job.roleType}
                            </span>
                            <span className="badge badge-xs badge-ghost">
                              {job.applicants?.length || 0} applicant
                              {(job.applicants?.length || 0) !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions for own profile */}
                      {isOwnProfile && (
                        <div
                          className="dropdown dropdown-end flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            tabIndex={0}
                            className="btn btn-ghost btn-xs btn-circle"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-36 z-10 text-xs"
                          >
                            <li>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/jobs/${job._id}/applicants`);
                                }}
                              >
                                View Applicants
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteJob(job._id);
                                }}
                                className="text-error"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Time + Deadline */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-base-content/40">
                      <span>{timeAgo(job.createdAt)}</span>
                      <span>
                        Deadline:{" "}
                        {new Date(job.deadline).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
