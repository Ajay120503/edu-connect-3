import { Eye, Bookmark, Users } from "lucide-react";

const ReachStats = ({ job, isOwner }) => {
  if (!isOwner) return null;

  return (
    <div className="flex gap-4 text-xs text-base-content/50 mt-2">
      <span className="flex items-center gap-1">
        <Eye size={12} /> {job.viewCount || 0} views
      </span>
      <span className="flex items-center gap-1">
        <Bookmark size={12} /> {job.saves?.length || 0} saves
      </span>
      <span className="flex items-center gap-1">
        <Users size={12} /> {job.applicants?.length || 0} applied
      </span>
    </div>
  );
};

export default ReachStats;
