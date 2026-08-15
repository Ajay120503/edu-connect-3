import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Save, ToggleLeft, ToggleRight, RefreshCw } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { isAdminUser } from "../../utils/badgeUtils";
import API from "../../utils/axios";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    autoApprove: false,
    autoBlockThreshold: 3,
    emailNotifications: true,
    moderationEnabled: true,
    requireReviewNewUsers: true,
    contentModerationRules: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initial fetch — inlined in effect to avoid setState-in-effect lint
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/admin/settings");
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Check admin access (after hooks)
  if (!isAuthenticated || !isAdminUser(currentUser)) {
    navigate("/feed");
    return null;
  }

  const fetchSettings = async () => {
    try {
      const { data } = await API.get("/admin/settings");
      if (data.settings) {
        setSettings(data.settings);
      }
      toast.success("Settings refreshed");
    } catch {
      // Use defaults
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put("/admin/settings", settings);
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="h-8 w-48 skeleton rounded mb-4"></div>
          <div className="card bg-base-100 border border-base-300 rounded-xl p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 skeleton rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-heading">Admin Settings</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/admin" className="btn btn-ghost btn-sm">
            Back to Dashboard
          </Link>
          <button
            onClick={fetchSettings}
            className="btn btn-ghost btn-sm"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-300/50">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4">Moderation Settings</h2>

          <div className="space-y-4">
            {/* Auto Approve */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-base-200/50">
              <div>
                <p className="font-medium text-sm">Auto-Approve Content</p>
                <p className="text-xs text-base-content/50">
                  Automatically approve new content without manual review
                </p>
              </div>
              <button
                onClick={() =>
                  handleChange("autoApprove", !settings.autoApprove)
                }
                className="btn btn-ghost btn-sm btn-circle"
              >
                {settings.autoApprove ? (
                  <ToggleRight className="w-5 h-5 text-success" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-base-content/40" />
                )}
              </button>
            </div>

            {/* Auto-block threshold */}
            <div className="p-3 rounded-xl bg-base-200/50">
              <label className="label pb-1">
                <span className="label-text text-xs font-medium">
                  Auto-Block Threshold (reports)
                </span>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="input input-bordered input-sm w-20"
                value={settings.autoBlockThreshold}
                onChange={(e) =>
                  handleChange("autoBlockThreshold", parseInt(e.target.value))
                }
              />
              <p className="text-xs text-base-content/50 mt-1">
                Automatically block content after this many reports
              </p>
            </div>

            {/* Email notifications */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-base-200/50">
              <div>
                <p className="font-medium text-sm">
                  Email Notifications for New Reports
                </p>
                <p className="text-xs text-base-content/50">
                  Send email when content is reported
                </p>
              </div>
              <button
                onClick={() =>
                  handleChange(
                    "emailNotifications",
                    !settings.emailNotifications,
                  )
                }
                className="btn btn-ghost btn-sm btn-circle"
              >
                {settings.emailNotifications ? (
                  <ToggleRight className="w-5 h-5 text-success" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-base-content/40" />
                )}
              </button>
            </div>

            {/* Moderation enabled */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-base-200/50">
              <div>
                <p className="font-medium text-sm">Content Moderation</p>
                <p className="text-xs text-base-content/50">
                  Enable content moderation queue
                </p>
              </div>
              <button
                onClick={() =>
                  handleChange("moderationEnabled", !settings.moderationEnabled)
                }
                className="btn btn-ghost btn-sm btn-circle"
              >
                {settings.moderationEnabled ? (
                  <ToggleRight className="w-5 h-5 text-success" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-base-content/40" />
                )}
              </button>
            </div>

            {/* Require review for new users */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-base-200/50">
              <div>
                <p className="font-medium text-sm">Review New Users</p>
                <p className="text-xs text-base-content/50">
                  Require manual approval for newly registered users
                </p>
              </div>
              <button
                onClick={() =>
                  handleChange(
                    "requireReviewNewUsers",
                    !settings.requireReviewNewUsers,
                  )
                }
                className="btn btn-ghost btn-sm btn-circle"
              >
                {settings.requireReviewNewUsers ? (
                  <ToggleRight className="w-5 h-5 text-success" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          {/* Save button */}
          <div className="mt-6 pt-4 border-t border-base-300/50">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary w-full gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
