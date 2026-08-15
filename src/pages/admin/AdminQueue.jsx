import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Clock, CheckCircle, RefreshCw } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { isAdminUser } from "../../utils/badgeUtils";
import API from "../../utils/axios";
import toast from "react-hot-toast";
import QueueItem from "../../components/admin/QueueItem";

const AdminQueue = () => {
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queueType, setQueueType] = useState("post");

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/admin/queue?type=${queueType}`);
      setItems(data.items || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch queue");
    } finally {
      setLoading(false);
    }
  }, [queueType]);

  // Initial fetch — inlined to avoid setState-in-effect lint
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/admin/queue?type=${queueType}`);
        setItems(data.items || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch queue");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [queueType]);

  // Check admin access (after hooks)
  if (!isAuthenticated || !isAdminUser(currentUser)) {
    navigate("/feed");
    return null;
  }

  const pendingCount = items.filter(
    (item) => item.status === "pending_review" || !item.status,
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-heading">
            Content Moderation Queue
          </h1>
        </div>
        <Link to="/admin" className="btn btn-ghost btn-sm">
          Back to Dashboard
        </Link>
      </div>

      {/* Content type tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-base-300/50 rounded-lg p-1">
          <button
            onClick={() => setQueueType("post")}
            className={`btn btn-sm btn-ghost ${
              queueType === "post" ? "btn-active" : ""
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setQueueType("job")}
            className={`btn btn-sm btn-ghost ${
              queueType === "job" ? "btn-active" : ""
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => setQueueType("story")}
            className={`btn btn-sm btn-ghost ${
              queueType === "story" ? "btn-active" : ""
            }`}
          >
            Stories
          </button>
        </div>

        <button
          onClick={fetchQueue}
          className="btn btn-ghost btn-sm"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="stats bg-base-100 shadow rounded-xl mb-6">
        <div className="stat">
          <div className="stat-figure text-warning">
            <Clock className="w-5 h-5" />
          </div>
          <div className="stat-title">Pending Review</div>
          <div className="stat-value text-warning text-lg">{pendingCount}</div>
        </div>
      </div>

      {/* Queue List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card bg-base-100 border border-base-300 rounded-xl p-5"
            >
              <div className="space-y-3">
                <div className="h-4 w-3/4 skeleton rounded"></div>
                <div className="h-3 w-1/2 skeleton rounded"></div>
                <div className="h-3 w-full skeleton rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-base-content/20" />
          </div>
          <h3 className="text-xl font-semibold text-base-content/40 mb-1">
            All Clear!
          </h3>
          <p className="text-sm text-base-content/30">
            No pending {queueType} items in the moderation queue.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <QueueItem
              key={item._id}
              item={item}
              type={queueType}
              onUpdate={fetchQueue}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQueue;
