import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  GraduationCap,
  TrendingUp,
  Clock,
  UserPlus,
  MapPin,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import API from "../utils/axios";
import useAuthStore from "../store/authStore";
import NoticeboardBanner from "../components/post/NoticeboardBanner";
import toast from "react-hot-toast";

const roleFilters = [
  { value: "", label: "All", icon: Users },
  { value: "student", label: "Students", icon: GraduationCap },
  { value: "teacher", label: "Teachers", icon: Users },
  { value: "professor", label: "Professors", icon: Users },
  { value: "hod", label: "HODs", icon: Users },
  { value: "principal", label: "Principals", icon: Users },
];

const Explore = () => {
  const { user: currentUser, setUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [trendingUsers, setTrendingUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [following, setFollowing] = useState(
    new Set(currentUser?.following || [])
  );

  const searchUsers = useCallback(
    async (q, role) => {
      if (!q.trim() && !role) return;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.append("q", q.trim());
        if (role) params.append("role", role);
        params.append("limit", "30");
        const { data } = await API.get(`/users/search?${params.toString()}`);
        const filtered = (data.users || []).filter(
          (u) => u._id !== currentUser?._id
        );
        setUsers(filtered);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    },
    [currentUser?._id]
  );

  // Fetch trending users (most followers)
  const fetchTrending = useCallback(async () => {
    try {
      const { data } = await API.get("/users/search?limit=8");
      const filtered = (data.users || [])
        .filter((u) => u._id !== currentUser?._id)
        .sort(
          (a, b) => (b.followers?.length || 0) - (a.followers?.length || 0)
        );
      setTrendingUsers(filtered.slice(0, 6));
    } catch {
      /* ignore */
    } finally {
      setTrendingLoading(false);
    }
  }, [currentUser?._id]);

  // Fetch recently joined users
  const fetchRecent = useCallback(async () => {
    try {
      const { data } = await API.get("/users/search?limit=10");
      const filtered = (data.users || [])
        .filter((u) => u._id !== currentUser?._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentUsers(filtered.slice(0, 6));
    } catch {
      /* ignore */
    } finally {
      setRecentLoading(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      searchUsers(q, roleFilter);
    }
    fetchTrending();
    fetchRecent();
  }, []);

  useEffect(() => {
    if (query.trim() || roleFilter) {
      searchUsers(query, roleFilter);
    }
  }, [roleFilter]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!query.trim() && !roleFilter) return;
    // Update URL
    const url = new URL(window.location);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    window.history.pushState({}, "", url);
    searchUsers(query, roleFilter);
  };

  const handleFollow = async (userId) => {
    try {
      const { data } = await API.post(`/users/${userId}/follow`);
      setFollowing((prev) => {
        const next = new Set(prev);
        if (data.isFollowing) next.add(userId);
        else next.delete(userId);
        return next;
      });
      toast.success(data.isFollowing ? "Following!" : "Unfollowed");
    } catch {
      toast.error("Failed to update follow");
    }
  };

  const isSearching = query.trim() || roleFilter;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
      <NoticeboardBanner />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-warning" />
          Explore
        </h1>
        <p className="text-sm text-base-content/50 mt-1">
          Discover students, teachers, and institutions
        </p>
      </div>

      {/* Search Bar + Filters */}
      <div className="space-y-3 mb-6">
        <form onSubmit={handleSearch}>
          <label className="input input-bordered flex items-center gap-2 rounded-2xl px-5 py-2 shadow-sm focus-within:shadow-md focus-within:border-primary/50 transition-all">
            <Search className="w-4 h-4 text-base-content/30 flex-shrink-0" />
            <input
              type="text"
              className="grow text-sm bg-transparent outline-none"
              placeholder="Search by name, skill, or institution..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="submit"
                className="btn btn-primary btn-xs rounded-full px-4"
              >
                Search
              </button>
            )}
          </label>
        </form>

        {/* Role Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {roleFilters.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.value}
                onClick={() => setRoleFilter(f.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  roleFilter === f.value
                    ? "bg-primary text-primary-content shadow-sm"
                    : "bg-base-200 text-base-content/60 hover:bg-base-300 hover:text-base-content/80"
                }`}
              >
                <Icon className="w-3 h-3" />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {isSearching ? (
        /* Search Results */
        <>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-base-100 border border-base-300/50 rounded-xl p-4"
                >
                  <div className="w-14 h-14 rounded-full skeleton flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 skeleton rounded"></div>
                    <div className="h-3 w-24 skeleton rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-base-content/40 font-medium mb-3 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                {users.length} result{users.length !== 1 ? "s" : ""} found
              </p>
              {users.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-4 bg-base-100 border border-base-300/50 rounded-2xl p-4 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all group"
                >
                  <Link
                    to={`/profile/${u._id}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden flex-shrink-0 ring-2 ring-base-100 shadow-sm group-hover:ring-primary/30 transition-all">
                      {u.profilePic?.url ? (
                        <img
                          src={u.profilePic.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg">
                          {u.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {u.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="badge badge-sm badge-soft badge-primary text-[10px] font-medium capitalize">
                          {u.role}
                        </span>
                        {u.institutionName && (
                          <span className="text-[11px] text-base-content/40 truncate">
                            {u.institutionName}
                          </span>
                        )}
                        {u.city && (
                          <span className="flex items-center gap-0.5 text-[10px] text-base-content/30">
                            <MapPin className="w-2.5 h-2.5" />
                            {u.city}
                          </span>
                        )}
                      </div>
                      {u.skills?.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {u.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="badge badge-xs badge-ghost text-[10px]"
                            >
                              {skill}
                            </span>
                          ))}
                          {u.skills.length > 3 && (
                            <span className="text-[10px] text-base-content/30">
                              +{u.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFollow(u._id);
                    }}
                    className={`btn btn-sm gap-1.5 flex-shrink-0 ${
                      following.has(u._id)
                        ? "btn-outline"
                        : "btn-primary shadow-md shadow-primary/20"
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {following.has(u._id) ? "Following" : "Follow"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="w-10 h-10 text-base-content/15" />
              </div>
              <h3 className="text-lg font-semibold text-base-content/40 mb-1">
                No users found
              </h3>
              <p className="text-sm text-base-content/30">
                Try a different search term or filter
              </p>
            </div>
          )}
        </>
      ) : (
        /* Default View - Trending + Recent */
        <div className="space-y-8">
          {/* Trending Users */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-warning" />
                </div>
                <h2 className="font-bold text-base">Trending</h2>
              </div>
              <span className="text-xs text-base-content/40">
                Most Followed
              </span>
            </div>
            {trendingLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-base-200 rounded-2xl p-4 space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full skeleton mx-auto"></div>
                    <div className="h-3 w-20 skeleton rounded mx-auto"></div>
                    <div className="h-2 w-14 skeleton rounded mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {trendingUsers.map((u) => (
                  <Link
                    key={u._id}
                    to={`/profile/${u._id}`}
                    className="card bg-base-100 border border-base-300/30 rounded-2xl p-4 text-center hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden ring-2 ring-base-100 shadow-sm mx-auto group-hover:ring-primary/30 transition-all">
                      {u.profilePic?.url ? (
                        <img
                          src={u.profilePic.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">
                          {u.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-sm mt-2.5 truncate group-hover:text-primary transition-colors">
                      {u.name}
                    </p>
                    <span className="badge badge-xs badge-soft badge-primary text-[10px] mt-1 capitalize">
                      {u.role}
                    </span>
                    {u.followers?.length > 0 && (
                      <p className="text-[10px] text-base-content/40 mt-1.5">
                        {u.followers.length} follower
                        {u.followers.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recently Joined */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-success" />
                </div>
                <h2 className="font-bold text-base">New to EduConnect</h2>
              </div>
              <span className="text-xs text-base-content/40">
                Recently Joined
              </span>
            </div>
            {recentLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-base-100 border border-base-300/50 rounded-xl p-4"
                  >
                    <div className="w-12 h-12 rounded-full skeleton flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 skeleton rounded"></div>
                      <div className="h-3 w-20 skeleton rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {recentUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-4 bg-base-100 border border-base-300/30 rounded-2xl p-4 hover:shadow-sm hover:border-primary/20 transition-all group"
                  >
                    <Link
                      to={`/profile/${u._id}`}
                      className="flex items-center gap-4 flex-1 min-w-0"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success/20 to-primary/20 overflow-hidden flex-shrink-0 ring-2 ring-base-100 shadow-sm group-hover:ring-primary/30 transition-all">
                        {u.profilePic?.url ? (
                          <img
                            src={u.profilePic.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                            {u.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                          {u.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="badge badge-xs badge-soft badge-primary text-[10px] font-medium capitalize">
                            {u.role}
                          </span>
                          {u.institutionName && (
                            <span className="text-[10px] text-base-content/40 truncate">
                              {u.institutionName}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFollow(u._id);
                      }}
                      className={`btn btn-xs gap-1 flex-shrink-0 ${
                        following.has(u._id)
                          ? "btn-outline"
                          : "btn-primary shadow-sm"
                      }`}
                    >
                      <UserPlus className="w-3 h-3" />
                      {following.has(u._id) ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="text-center pb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/10">
              <Users className="w-8 h-8 text-primary/30" />
            </div>
            <p className="text-sm text-base-content/40 font-medium">
              Can't find who you're looking for?
            </p>
            <p className="text-xs text-base-content/30 mt-1 mb-3">
              Try searching by name, skill, or institution above
            </p>
            <button
              onClick={() =>
                document.querySelector('input[type="text"]')?.focus()
              }
              className="btn btn-sm btn-ghost text-primary gap-1.5"
            >
              Start Searching <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
