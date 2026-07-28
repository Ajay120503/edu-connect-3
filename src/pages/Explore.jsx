import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Users, GraduationCap } from "lucide-react";
import API from "../utils/axios";

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const searchUsers = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const { data } = await API.get(`/users/search?q=${q}`);
      setUsers(data.users || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      searchUsers(q);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold font-heading mb-1">Explore</h1>
      <p className="text-sm text-base-content/40 mb-6">
        Search for students, teachers, and institutions
      </p>

      {/* Search Input */}
      <label className="input input-bordered flex items-center gap-2 rounded-full px-5 py-1.5 mb-6 shadow-sm">
        <Search className="w-4.5 h-4.5 text-base-content/30" />
        <input
          type="text"
          className="grow text-sm"
          placeholder="Search by name, role, skill, or institution..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchUsers(query)}
        />
        {query && (
          <button
            onClick={() => searchUsers(query)}
            className="btn btn-primary btn-xs rounded-full px-3"
          >
            Search
          </button>
        )}
      </label>

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
        <div className="space-y-3">
          <p className="text-xs text-base-content/30 font-medium mb-3">
            {users.length} result{users.length !== 1 ? "s" : ""} found
          </p>
          {users.map((u) => (
            <Link
              key={u._id}
              to={`/profile/${u._id}`}
              className="flex items-center gap-4 bg-base-100 border border-base-300/50 rounded-xl p-4 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden flex-shrink-0 ring-2 ring-base-100 shadow-sm group-hover:ring-primary/30 transition-all">
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
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {u.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="badge badge-sm badge-soft badge-primary text-[10px] font-medium">
                    {u.role}
                  </span>
                  {u.institutionName && (
                    <span className="text-[11px] text-base-content/40 truncate">
                      · {u.institutionName}
                    </span>
                  )}
                </div>
                {u.skills?.length > 0 && (
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
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
                        +{u.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-xs text-base-content/20 group-hover:text-primary/40 transition-colors flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Search className="w-10 h-10 text-base-content/15" />
          </div>
          <h3 className="text-lg font-semibold text-base-content/40 mb-1">
            No users found
          </h3>
          <p className="text-sm text-base-content/30">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <GraduationCap className="w-10 h-10 text-base-content/15" />
          </div>
          <h3 className="text-lg font-semibold text-base-content/40 mb-1">
            Search the community
          </h3>
          <p className="text-sm text-base-content/30">
            Find students, teachers, and institutions
          </p>
        </div>
      )}
    </div>
  );
};

export default Explore;
