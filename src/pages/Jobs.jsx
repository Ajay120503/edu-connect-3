import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, DollarSign, Clock, Plus } from "lucide-react";
import API from "../utils/axios";
import useAuthStore from "../store/authStore";
import MatchedJobsRow from "../components/job/MatchedJobsRow";
import QuickApplyBtn from "../components/job/QuickApplyBtn";

const CAN_POST_JOBS = ["teacher", "professor", "hod", "principal"];

const Jobs = () => {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const canPost = user && CAN_POST_JOBS.includes(user.role);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/jobs");
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
        <div className="h-10 w-32 skeleton mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card border border-base-300/50 p-5 space-y-3">
            <div className="h-5 w-3/4 skeleton rounded"></div>
            <div className="h-4 w-1/2 skeleton rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const filtered =
    filter === "all"
      ? jobs
      : jobs.filter((j) => j.isPaid === (filter === "paid"));

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <MatchedJobsRow />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Job Board</h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            Find academic opportunities
          </p>
        </div>
        <div className="flex gap-2">
          <select
            className="select select-bordered select-sm text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Jobs</option>
            <option value="paid">Paid Only</option>
            <option value="unpaid">Unpaid Only</option>
          </select>

          {canPost && (
            <Link to="/jobs/create" className="btn btn-primary btn-sm gap-1.5">
              <Plus className="w-4 h-4" />
              Post a Job
            </Link>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="w-16 h-16 text-base-content/15 mx-auto mb-4" />
          <p className="text-base-content/40 font-medium">No jobs found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className="card bg-base-100 border border-base-300/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-5 block"
            >
              <div className="flex items-start gap-4">
                {/* Job image or institution logo */}
                <div className="w-14 h-14 rounded-xl bg-placeholder overflow-hidden shrink-0">
                  {job.image?.url ? (
                    <img
                      src={job.image.url}
                      alt={job.title}
                      className="w-full h-full object-cover"
                    />
                  ) : job.institutionLogo?.url ? (
                    <img
                      src={job.institutionLogo.url}
                      alt={job.institutionName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-base-content/40" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1.5">
                        {job.title}
                      </h3>
                      <p className="text-sm text-base-content/50 mb-3">
                        {job.institutionName || "Unknown Institution"}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-base-content/50">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            job.isPaid ? "text-success" : "text-base-content/40"
                          }`}
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.isPaid
                            ? `₹${job.stipend?.toLocaleString() || 0}`
                            : "Unpaid"}
                        </span>
                        <span className="flex items-center gap-1 text-base-content/40">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <QuickApplyBtn
                        jobId={job._id}
                        alreadyApplied={job.applicants?.includes?.(user?._id)}
                      />
                      <span className="badge badge-sm badge-soft badge-primary text-xs font-medium">
                        {job.roleType}
                      </span>
                      {job.applicants?.length > 0 && (
                        <span className="text-xs text-base-content/30">
                          {job.applicants.length} applicants
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
