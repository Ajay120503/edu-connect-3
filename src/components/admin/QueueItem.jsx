import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Users,
  Eye,
} from "lucide-react";
import BadgeChip from "../common/BadgeChip";
import API from "../../utils/axios";
import toast from "react-hot-toast";

/**
 * Reusable admin content moderation queue item.
 *
 * @param {object} item - The content item (post, job, or story)
 * @param {string} type - The content type ('post', 'job', 'story')
 * @param {function} onUpdate - Callback to refresh parent data after actions
 */
const QueueItem = ({ item, type, onUpdate }) => {
  const [actionLoading, setActionLoading] = useState(false);

  const handleModerate = async (action) => {
    setActionLoading(true);
    try {
      const endpoint = `/admin/content/${type}/${item._id}/${action}`;
      const body =
        action === "reject"
          ? { notes: "Content does not meet community guidelines" }
          : {};

      const { data } = await API.put(endpoint, body);
      if (data.success !== false) {
        toast.success(
          action === "approve" ? "Content approved!" : "Content rejected",
        );
        onUpdate?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Moderation action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const authorName = item.author?.name || item.postedBy?.name || "Unknown";
  const authorEmail = item.author?.email || item.postedBy?.email || "";
  const authorBadge = item.author?.badges?.[0]?.type || "student";

  return (
    <div className="card bg-base-200/30 border border-base-300 rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        {/* Author info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {item.author?.profilePic?.url || item.postedBy?.profilePic?.url ? (
              <img
                src={
                  item.author?.profilePic?.url || item.postedBy?.profilePic?.url
                }
                alt={authorName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Users className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <div className="font-semibold text-sm">{authorName}</div>
            <div className="text-xs text-base-content/50">{authorEmail}</div>
            <div className="mt-1">
              <BadgeChip badgeType={authorBadge} size="sm" />
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-base-content/50 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(item.createdAt)}
        </div>
      </div>

      {/* Content preview */}
      <div>
        <h3 className="font-medium text-sm">{item.title || "Untitled"}</h3>
        <p className="text-sm text-base-content/70 mt-1 line-clamp-3">
          {item.preview ||
            item.content?.substring(0, 150) ||
            item.description?.substring(0, 150) ||
            ""}
          {item.content?.length > 150 && "..."}
        </p>

        {/* Detection rules (if any) */}
        {item.detectionRules?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.detectionRules.map((rule, i) => (
              <span
                key={i}
                className="badge badge-xs badge-warning badge-soft gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                {rule.rule}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-base-300/50">
        <Link
          to={`/admin/content/${type}/${item._id}`}
          className="btn btn-ghost btn-xs gap-1.5"
        >
          <Eye className="w-3 h-3" />
          Review Detail
        </Link>

        <div className="flex gap-2">
          <button
            onClick={() => handleModerate("reject")}
            className="btn btn-outline btn-error btn-sm"
            disabled={actionLoading}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </button>
          <button
            onClick={() => handleModerate("approve")}
            className="btn btn-primary btn-sm"
            disabled={actionLoading}
          >
            {actionLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueItem;
