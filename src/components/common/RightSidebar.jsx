import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Briefcase,
  MapPin,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import API from "../../utils/axios";
import useAuthStore from "../../store/authStore";
import UserAvatar from "./UserAvatar";
import { getUserRoleLabel } from "../../utils/badgeUtils";

const RightSidebar = () => {
  const { user } = useAuthStore();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const { data } = await API.get("/users/search?limit=10");
        const users = (data.users || []).filter((u) => u._id !== user?._id);
        setSuggestedUsers(users.slice(0, 5));
      } catch {
        // Silently fail
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchRecentJobs = async () => {
      try {
        const { data } = await API.get("/jobs?limit=10");
        const jobs = (data.jobs || []).filter(
          (j) => j.postedBy?._id !== user?._id
        );
        setRecentJobs(jobs.slice(0, 5));
      } catch {
        // Silently fail
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchSuggestedUsers();
    fetchRecentJobs();
  }, [user?._id]);

  return (
    <aside className="hidden lg:flex flex-col w-80 bg-base-100 border-l border-base-200/80 sticky top-0 h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
        {/* Who to Follow */}
        <div className="card bg-base-200/50 border border-base-300/30 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-primary" />
                </div>
                Who to Follow
              </h3>
              <Link
                to="/explore"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                See all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loadingUsers ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full skeleton flex-shrink-0"></div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 w-24 skeleton rounded"></div>
                      <div className="h-2.5 w-16 skeleton rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : suggestedUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-base-300/50 flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="w-6 h-6 text-base-content/20" />
                </div>
                <p className="text-xs text-base-content/40 font-medium">
                  No suggestions yet
                </p>
                <p className="text-[11px] text-base-content/30 mt-0.5">
                  Explore the community to find people
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {suggestedUsers.map((u) => (
                  <Link
                    key={u._id}
                    to={`/profile/${u._id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-base-200/70 transition-all group"
                  >
                    <UserAvatar user={u} size={40} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                        {u.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="badge badge-xs badge-soft badge-primary text-[10px] capitalize font-medium">
                          {getUserRoleLabel(u)}
                        </span>
                        {u.institutionName && (
                          <span className="text-[10px] text-base-content/40 truncate">
                            {u.institutionName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <UserPlus className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trending Jobs */}
        <div className="card bg-base-200/50 border border-base-300/30 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-warning" />
                </div>
                Trending Jobs
              </h3>
              <Link
                to="/jobs"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loadingJobs ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2 p-2.5">
                    <div className="h-3.5 w-full skeleton rounded"></div>
                    <div className="h-2.5 w-3/4 skeleton rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-5 w-12 skeleton rounded-full"></div>
                      <div className="h-5 w-14 skeleton rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-base-300/50 flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-base-content/20" />
                </div>
                <p className="text-xs text-base-content/40 font-medium">
                  No jobs posted yet
                </p>
                <p className="text-[11px] text-base-content/30 mt-0.5">
                  Be the first to post an opportunity
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentJobs.map((job) => (
                  <Link
                    key={job._id}
                    to={`/jobs/${job._id}`}
                    className="block p-2.5 rounded-xl hover:bg-base-200/70 transition-all group"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Briefcase className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                          {job.title}
                        </p>
                        <p className="text-xs text-base-content/50 truncate mt-0.5">
                          {job.institutionName || "Institution"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="flex items-center gap-1 text-[10px] text-base-content/40">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                          <span
                            className={`flex items-center gap-1 text-[10px] font-medium ${
                              job.isPaid
                                ? "text-success"
                                : "text-base-content/40"
                            }`}
                          >
                            {job.isPaid
                              ? job.currency === "USD"
                                ? `$${Number(job.stipend).toLocaleString()}`
                                : `₹${Number(job.stipend).toLocaleString()}`
                              : "Volunteer"}
                          </span>
                        </div>
                        {job.skillsRequired?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {job.skillsRequired.slice(0, 2).map((skill, i) => (
                              <span
                                key={i}
                                className="badge badge-xs badge-outline text-[9px] px-1.5"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skillsRequired.length > 2 && (
                              <span className="text-[9px] text-base-content/30">
                                +{job.skillsRequired.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Tip Card */}
        <div className="card bg-primary/5 border border-primary/10 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Complete Your Profile</p>
                <p className="text-xs text-base-content/50 mt-1 leading-relaxed">
                  A complete profile gets 3x more visibility from institutions
                  and recruiters.
                </p>
                <Link
                  to="/edit-profile"
                  className="btn btn-xs btn-ghost text-primary mt-2 px-0 hover:underline"
                >
                  Update now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-base-200/80 flex-shrink-0">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
            <FontAwesomeIcon
              icon={faUserGraduate}
              className="w-8 h-8 text-primary"
            />
          </div>
          <span className="text-xs font-semibold text-base-content/40">
            EduConnect
          </span>
        </div>
        <p className="text-[10px] text-base-content/30 text-center leading-relaxed">
          Where Academic Careers Begin · © {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
