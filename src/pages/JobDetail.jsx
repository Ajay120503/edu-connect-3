import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, DollarSign, Calendar, Mail, Users } from "lucide-react";
import useAuthStore from "../store/authStore";
import API from "../utils/axios";
import toast from "react-hot-toast";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setJob(data.job);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      await API.post(`/jobs/${id}/apply`, { coverLetter: "" });
      toast.success("Applied successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    }
  };

  const isJobPoster = job?.postedBy?._id === user?._id;
  const isFaculty = ["teacher", "professor", "hod", "principal"].includes(
    user?.role
  );

  if (loading) return <div className="max-w-2xl mx-auto p-6">Loading...</div>;
  if (!job)
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">Job not found</div>
    );

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <Link to="/jobs" className="text-primary text-sm mb-4 inline-block">
        ← Back to Jobs
      </Link>
      <div className="card bg-base-100 shadow-sm border border-base-300 p-6">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-base-content/60 mt-1">{job.institutionName}</p>
        <div className="flex gap-4 mt-4 text-sm">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {job.isPaid ? `₹${job.stipend}` : "Unpaid"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(job.deadline).toLocaleDateString()}
          </span>
        </div>
        <p className="mt-4">{job.description}</p>
        {job.skillsRequired?.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {job.skillsRequired.map((s, i) => (
              <span key={i} className="badge badge-sm">
                #{s}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-4 text-sm">
          <Mail className="w-4 h-4" />
          {job.contactEmail}
        </div>

        {/* Faculty actions */}
        {isJobPoster && isFaculty && (
          <div className="mt-6 space-y-3">
            <Link
              to={`/jobs/${job._id}/applicants`}
              className="btn btn-primary w-full gap-2"
            >
              <Users className="w-4 h-4" />
              View Applicants ({job.applicants?.length || 0})
            </Link>
          </div>
        )}

        {/* Student actions */}
        {user?.role === "student" && (
          <button onClick={handleApply} className="btn btn-primary mt-6 w-full">
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
