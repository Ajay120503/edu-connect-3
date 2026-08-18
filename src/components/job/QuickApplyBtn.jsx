import { useState } from "react";
import { Zap } from "lucide-react";
import API from "../../utils/axios";
import { calcStrength } from "../../utils/profileStrength";
import useAuthStore from "../../store/authStore";
import { canApplyToJobs } from "../../utils/badgeUtils";
import toast from "react-hot-toast";

const QuickApplyBtn = ({ jobId, alreadyApplied, onApplied }) => {
  const { user } = useAuthStore();
  const [localApply, setLocalApply] = useState({ jobId: null, applied: false });
  const [loading, setLoading] = useState(false);
  const applied =
    Boolean(alreadyApplied) ||
    (localApply.jobId === jobId && localApply.applied);

  const profileStrength = calcStrength(user);
  if (profileStrength < 80 || !canApplyToJobs(user) || applied) return null;

  const handleQuickApply = async () => {
    setLoading(true);
    try {
      await API.post(`/jobs/${jobId}/quick-apply`);
      setLocalApply({ jobId, applied: true });
      onApplied?.();
      toast.success("Applied successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Quick apply failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-primary btn-sm gap-1.5"
      onClick={handleQuickApply}
      disabled={loading}
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <Zap size={14} />
      )}
      Quick Apply
    </button>
  );
};

export default QuickApplyBtn;
