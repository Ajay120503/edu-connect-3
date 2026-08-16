import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  Clock,
  Briefcase,
  FileText,
  Globe,
  Award,
  Heart,
  Calendar,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import API from "../utils/axios";
import ApplicantKanban from "../components/job/ApplicantKanban";
import UserAvatar from "../components/common/UserAvatar";
import toast from "react-hot-toast";

const statusColors = {
  applied: "badge-ghost",
  reviewed: "badge-info",
  shortlisted: "badge-warning",
  rejected: "badge-error",
  selected: "badge-success",
};

const statusSteps = ["applied", "reviewed", "shortlisted", "selected"];

const ApplicantCard = ({ app, onStatusUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const a = app.applicant || {};

  return (
    <div className="card bg-base-100 border border-base-300/50 shadow-sm hover:shadow-md transition-all">
      {/* Compact Header */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <UserAvatar user={a} size={56} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/profile/${a?._id}`}
                  className="font-semibold text-base hover:text-primary transition-colors"
                >
                  {a?.name || "Unknown"}
                </Link>
                <span
                  className={`badge badge-sm ${
                    statusColors[app.status] || "badge-ghost"
                  } font-medium`}
                >
                  {app.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap text-sm text-base-content/50">
                {a?.educationLevel && (
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={faUserGraduate}
                      className="w-3.5 h-3.5"
                      fontSize={24}
                    />
                    {a.educationLevel}
                  </span>
                )}
                {a?.profession && <span>· {a.profession}</span>}
                {a?.city && a?.state && (
                  <span>
                    · {a.city}, {a.state}
                  </span>
                )}
              </div>
              {a?.bio && (
                <p className="text-sm text-base-content/60 mt-1.5 line-clamp-2">
                  {a.bio}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
            {/* Status update buttons */}
            <div className="flex items-center gap-1">
              {statusSteps.map((step) => {
                const currentIdx = statusSteps.indexOf(app.status);
                const stepIdx = statusSteps.indexOf(step);
                const isPast = currentIdx >= stepIdx;
                return (
                  <button
                    key={step}
                    onClick={() => onStatusUpdate(app._id, step)}
                    disabled={step === app.status}
                    title={`Mark as ${step}`}
                    className={`btn btn-xs btn-circle transition-all ${
                      step === app.status
                        ? "btn-primary"
                        : isPast
                          ? "btn-ghost text-primary/40"
                          : "btn-ghost text-base-content/20 hover:text-primary"
                    }`}
                  >
                    {step === "selected" ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </button>
                );
              })}
              {app.status !== "rejected" && (
                <button
                  onClick={() => onStatusUpdate(app._id, "rejected")}
                  title="Reject"
                  className="btn btn-xs btn-circle btn-ghost text-error/50 hover:text-error"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="btn btn-xs btn-ghost gap-1"
            >
              {expanded ? (
                <>
                  Less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Details <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skills */}
        {a?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {a.skills.map((skill, i) => (
              <span
                key={i}
                className="badge badge-sm badge-soft badge-primary text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-base-200 px-5 py-4 space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {a?.age && (
              <div className="bg-base-200/50 rounded-lg p-3 text-center">
                <Calendar className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-xs text-base-content/40">Age</p>
                <p className="text-sm font-semibold">{a.age}</p>
              </div>
            )}
            {a?.experience > 0 && (
              <div className="bg-base-200/50 rounded-lg p-3 text-center">
                <Briefcase className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-xs text-base-content/40">Experience</p>
                <p className="text-sm font-semibold">{a.experience} yrs</p>
              </div>
            )}
            {a?.educationLevel && (
              <div className="bg-base-200/50 rounded-lg p-3 text-center">
                <FontAwesomeIcon
                  icon={faUserGraduate}
                  className="w-4 h-4 mx-auto text-primary mb-1"
                  fontSize={24}
                />
                <p className="text-xs text-base-content/40">Education</p>
                <p className="text-sm font-semibold capitalize">
                  {a.educationLevel}
                </p>
              </div>
            )}
            {a?.subject && (
              <div className="bg-base-200/50 rounded-lg p-3 text-center">
                <BookOpen className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-xs text-base-content/40">Subject</p>
                <p className="text-sm font-semibold">{a.subject}</p>
              </div>
            )}
          </div>

          {/* Qualifications */}
          {a?.qualifications?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Qualifications
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {a.qualifications.map((q, i) => (
                  <span key={i} className="badge badge-sm badge-outline">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {a?.interests?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> Interests
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {a.interests.map((interest, i) => (
                  <span key={i} className="badge badge-sm badge-ghost">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cover Letter */}
          {app.coverLetter && (
            <div>
              <h4 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Cover Letter
              </h4>
              <p className="text-sm text-base-content/70 bg-base-200/50 rounded-lg p-3 whitespace-pre-wrap">
                {app.coverLetter}
              </p>
            </div>
          )}

          {/* Cover Letter File */}
          {app.coverLetterFile?.url && (
            <a
              href={app.coverLetterFile.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-xs gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> View Cover Letter Attachment
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Links & Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-base-200">
            <a
              href={`mailto:${a?.email}`}
              className="btn btn-primary btn-xs gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> {a?.email || "Email"}
            </a>
            {a?.resumeUrl && (
              <a
                href={a.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-xs gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Resume
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {a?.linkedinUrl && (
              <a
                href={a.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-xs gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" /> LinkedIn
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <Link
              to={`/profile/${a?._id}`}
              className="btn btn-ghost btn-xs gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Full Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const JobApplicants = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" or "kanban"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          API.get(`/jobs/${id}`),
          API.get(
            `/jobs/${id}/applicants${
              filterStatus ? `?status=${filterStatus}` : ""
            }`
          ),
        ]);
        setJob(jobRes.data.job);
        setApplications(appRes.data.applications);
      } catch {
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, filterStatus]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await API.put(`/jobs/applications/${applicationId}/status`, { status });
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
      toast.success(`Application marked as ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="h-8 w-48 skeleton rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card border border-base-300/50 p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full skeleton"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 skeleton rounded"></div>
                  <div className="h-3 w-48 skeleton rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p>Job not found</p>
        <Link to="/jobs" className="btn btn-primary mt-4">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <Link
        to={`/jobs/${id}`}
        className="text-primary text-sm flex items-center gap-1 mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Job
      </Link>

      <div className="card bg-base-100 border border-base-300/50 p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold font-heading">{job.title}</h1>
            <p className="text-sm text-base-content/60 mt-0.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              {job.institutionName} · {job.location}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-base-content/50">
              <UserCheck className="w-4 h-4" />
              {applications.length} applicant{applications.length !== 1 && "s"}
            </span>
          </div>
        </div>
      </div>

      {/* View Toggle + Filter */}
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`btn btn-xs ${
              viewMode === "list" ? "btn-primary" : "btn-ghost"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`btn btn-xs ${
              viewMode === "kanban" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Kanban
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-base-content/60">
            Filter:
          </span>
          {[
            "",
            "applied",
            "reviewed",
            "shortlisted",
            "selected",
            "rejected",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`badge badge-sm cursor-pointer transition-all ${
                filterStatus === status
                  ? "badge-primary"
                  : status
                  ? `${statusColors[status]} hover:opacity-70`
                  : "badge-ghost hover:badge-primary"
              }`}
            >
              {status || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Applications */}
      {viewMode === "kanban" ? (
        <ApplicantKanban
          applications={applications}
          onStatusChange={() => {}}
        />
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <Eye className="w-16 h-16 mx-auto text-base-content/15 mb-4" />
          <p className="text-base-content/40 font-medium">
            No applications yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicantCard
              key={app._id}
              app={app}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
