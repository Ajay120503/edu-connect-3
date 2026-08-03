import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  DollarSign,
  Users,
  ArrowRight,
} from "lucide-react";

const LinkedJobCard = ({ job }) => {
  if (!job) return null;

  const deadlinePassed = job.deadline && new Date(job.deadline) < new Date();
  const StipendIcon = job.currency === "USD" ? DollarSign : IndianRupee;

  const formatStipend = () => {
    if (!job.isPaid || !job.stipend) return "Unpaid";
    const value = Number(job.stipend).toLocaleString("en-IN");
    return `${job.currency === "USD" ? "$" : "₹"}${value}`;
  };

  const formatDeadline = () => {
    if (!job.deadline) return "";
    return new Date(job.deadline).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link to={`/jobs/${job._id}`} className="block mb-4 group">
      <div className="card bg-base-200/70 border border-base-300 hover:border-primary/50 transition-colors overflow-hidden">
        <div className="card-body p-4">
          {/* Header Row */}
          <div className="flex items-start gap-3">
            {/* Logo / Icon */}
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {job.institutionLogo?.url ? (
                <img
                  src={job.institutionLogo.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <Briefcase className="w-5 h-5 text-primary" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="badge badge-xs badge-primary badge-soft font-semibold uppercase tracking-wide">
                  Job Opening
                </span>
                {deadlinePassed && (
                  <span className="badge badge-xs badge-error badge-soft">
                    Deadline Passed
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-xs text-base-content/50 truncate">
                {job.institutionName || job.postedBy?.institutionName}
              </p>
            </div>
          </div>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-base-content/60">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="capitalize">{job.roleType}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="capitalize">{job.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <StipendIcon className="w-3.5 h-3.5" />
              {formatStipend()}
            </span>
            {job.deadline && (
              <span
                className={`flex items-center gap-1 ${
                  deadlinePassed ? "text-error" : ""
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {formatDeadline()}
              </span>
            )}
          </div>

          {/* Skills */}
          {job.skillsRequired?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-3">
              {job.skillsRequired.slice(0, 4).map((skill, i) => (
                <span
                  key={i}
                  className="badge badge-sm badge-ghost text-[11px] font-medium"
                >
                  {skill}
                </span>
              ))}
              {job.skillsRequired.length > 4 && (
                <span className="badge badge-sm badge-ghost text-[11px] font-medium">
                  +{job.skillsRequired.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300/60">
            <span className="text-[11px] text-base-content/40 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {job.applicants?.length || 0} applicants
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              View Job
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LinkedJobCard;
