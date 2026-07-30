import { useState } from "react";
import { Zap } from "lucide-react";
import API from "../../utils/axios";
import { calcStrength } from "../../utils/profileStrength";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const QuickApplyBtn = ({ jobId, alreadyApplied }) => {
  const { user } = useAuthStore();
  const [applied, setApplied] = useState(alreadyApplied);
  const [loading, setLoading] = useState(false);

  const profileStrength = calcStrength(user);
  if (profileStrength < 80 || user?.role !== "student" || applied) return null;

  const handleQuickApply = async () => {
    setLoading(true);
    try {
      await API.post(`/jobs/${jobId}/quick-apply`);
      setApplied(true);
      toast.success("Applied successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Quick apply failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-success btn-sm gap-1.5"
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
