import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Briefcase } from "lucide-react";
import API from "../../utils/axios";

const RightSidebar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const { data } = await API.get("/users/search?limit=5");
        setSuggestedUsers(data.users || []);
      } catch {
        // Silently fail
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchRecentJobs = async () => {
      try {
        const { data } = await API.get("/jobs?limit=5");
        setRecentJobs(data.jobs || []);
      } catch {
        // Silently fail
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchSuggestedUsers();
    fetchRecentJobs();
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-base-100 border-l border-base-300 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
      {/* Suggested Users */}
      <div className="bg-base-200 rounded-xl p-4 mb-4 flex-1 overflow-y-auto">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          Suggested Users
        </h3>
        {loadingUsers ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full skeleton"></div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 skeleton rounded"></div>
                  <div className="h-2 w-16 skeleton rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : suggestedUsers.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-5 h-5 text-base-content/30" />
            </div>
            <p className="text-xs text-base-content/40">No users yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestedUsers.slice(0, 5).map((u) => (
              <Link
                key={u._id}
                to={`/profile/${u._id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-placeholder overflow-hidden flex-shrink-0">
                  {u.profilePic?.url ? (
                    <img
                      src={u.profilePic.url}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-base-content/40 font-bold">
                      {u.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.name}</p>
                  <p className="text-xs text-base-content/40 truncate">
                    {u.role} {u.institutionName && `· ${u.institutionName}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Jobs */}
      <div className="bg-base-200 rounded-xl p-4 flex-1 overflow-y-auto">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          Recent Jobs
        </h3>
        {loadingJobs ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-full skeleton rounded"></div>
                <div className="h-2 w-3/4 skeleton rounded"></div>
                <div className="h-2 w-1/2 skeleton rounded"></div>
              </div>
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-2">
              <Briefcase className="w-5 h-5 text-base-content/30" />
            </div>
            <p className="text-xs text-base-content/40">No jobs posted yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentJobs.slice(0, 5).map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="block p-2 rounded-lg hover:bg-base-300/50 transition-colors"
              >
                <p className="text-sm font-medium truncate">{job.title}</p>
                <p className="text-xs text-base-content/40 truncate mt-0.5">
                  {job.institutionName || "Institution"}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="badge badge-xs badge-ghost text-[10px]">
                    {job.location}
                  </span>
                  <span
                    className={`badge badge-xs text-[10px] ${
                      job.isPaid ? "badge-success" : "badge-ghost"
                    }`}
                  >
                    {job.isPaid ? `₹${job.stipend}` : "Unpaid"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 text-xs text-base-content/40 text-center flex-shrink-0">
        <p>© 2026 EduConnect</p>
        <p className="mt-1">Where Academic Careers Begin</p>
      </div>
    </aside>
  );
};

export default RightSidebar;
