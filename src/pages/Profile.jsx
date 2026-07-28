import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  UserPlus,
  MessageCircle,
  MapPin,
  Mail,
  Calendar,
  Edit3,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import API from "../utils/axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/users/${id}`);
      setProfile(data.user);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    try {
      await API.post(`/users/${id}/follow`);
      fetchProfile();
      toast.success("Updated!");
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="card border border-base-300/50 p-8 text-center space-y-4">
          <div className="w-28 h-28 rounded-full skeleton mx-auto"></div>
          <div className="h-6 w-48 skeleton rounded mx-auto"></div>
          <div className="h-4 w-32 skeleton rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!profile)
    return (
      <div className="max-w-3xl mx-auto p-6 text-center py-20">
        <h2 className="text-xl font-semibold text-base-content/40">
          User not found
        </h2>
      </div>
    );

  const isOwnProfile = currentUser?._id === id;
  const isFollowing = profile.followers?.includes(currentUser?._id);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      {/* Profile Header */}
      <div className="card bg-base-100 border border-base-300/50 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20"></div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex justify-center -mt-14 mb-4">
            <div className="w-28 h-28 rounded-full bg-primary/10 overflow-hidden ring-4 ring-base-100 shadow-lg">
              {profile.profilePic?.url ? (
                <img
                  src={profile.profilePic.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary text-4xl font-bold">
                  {profile.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>

          {/* Name + Bio */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold font-heading mb-1">
              {profile.name}
            </h1>
            <div className="flex items-center justify-center gap-1.5 text-sm text-base-content/50 mb-3">
              <span className="badge badge-sm badge-soft badge-primary font-medium">
                {profile.role}
              </span>
              {profile.institutionName && (
                <span className="badge badge-sm badge-ghost font-medium">
                  {profile.institutionName}
                </span>
              )}
            </div>
            {profile.bio && (
              <p className="text-sm text-base-content/60 max-w-md mx-auto leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex justify-center gap-10 mb-6">
            <div className="text-center">
              <p className="text-lg font-bold">
                {profile.followers?.length || 0}
              </p>
              <p className="text-xs text-base-content/40 font-medium">
                Followers
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">
                {profile.following?.length || 0}
              </p>
              <p className="text-xs text-base-content/40 font-medium">
                Following
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{profile.posts?.length || 0}</p>
              <p className="text-xs text-base-content/40 font-medium">Posts</p>
            </div>
          </div>

          {/* Action Buttons */}
          {!isOwnProfile ? (
            <div className="flex justify-center gap-3">
              <button
                onClick={handleFollow}
                className={`btn btn-sm gap-2 font-medium ${
                  isFollowing
                    ? "btn-outline"
                    : "btn-primary shadow-lg shadow-primary/20"
                }`}
              >
                <UserPlus className="w-4 h-4" />{" "}
                {isFollowing ? "Following" : "Follow"}
              </button>
              <Link
                to={`/chat/${profile._id}`}
                className="btn btn-outline btn-sm gap-2 font-medium"
              >
                <MessageCircle className="w-4 h-4" /> Message
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link
                to="/edit-profile"
                className="btn btn-outline btn-sm gap-2 font-medium"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Link>
            </div>
          )}

          {/* Details */}
          {(profile.city || profile.state || profile.email) && (
            <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-base-200 text-xs text-base-content/50">
              {profile.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {profile.city}
                  {profile.state ? `, ${profile.state}` : ""}
                </span>
              )}
              {profile.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {profile.email}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
