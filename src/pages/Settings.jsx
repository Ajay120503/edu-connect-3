import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import ConfirmModal from "../components/common/ConfirmModal";
import API from "../utils/axios";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, logout, deleteAccount, isLoading, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [opportunityLoading, setOpportunityLoading] = useState(false);

  const handleOpportunityToggle = async () => {
    setOpportunityLoading(true);
    try {
      const { data } = await API.patch("/users/me/opportunity-status", {
        openToOpportunities: !user?.openToOpportunities,
      });
      setUser({ ...user, openToOpportunities: data.openToOpportunities });
      toast.success(
        data.openToOpportunities
          ? "You are now open to opportunities!"
          : "Opportunity status disabled"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setOpportunityLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success("Your account has been deleted.");
      setShowDeleteModal(false);
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete account.";
      toast.error(message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold font-heading mb-6">Settings</h1>

      {/* Account Info */}
      <div className="card bg-base-100 shadow-sm border border-base-300 p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-base-200">
            <span className="text-sm text-base-content/60">Name</span>
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-base-200">
            <span className="text-sm text-base-content/60">Email</span>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-base-content/60">Role</span>
            <span className="text-sm font-medium capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Open to Opportunities Toggle (Students only) */}
      {user?.role === "student" && (
        <div className="card bg-base-100 shadow-sm border border-base-300 p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Opportunities</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Open to Opportunities</p>
              <p className="text-xs text-base-content/50">
                Let institutions know you're available for roles
              </p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-success"
              checked={user?.openToOpportunities || false}
              onChange={handleOpportunityToggle}
              disabled={opportunityLoading}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="card bg-base-100 shadow-sm border border-base-300 p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button
            onClick={logout}
            className="btn btn-outline btn-warning w-full"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card bg-base-100 shadow-sm border border-error/30 p-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-lg text-error">Danger Zone</h3>
        </div>
        <p className="text-sm text-base-content/60 mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="btn btn-error w-full"
          disabled={isLoading}
        >
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account?"
        message="This will permanently delete your account, posts, comments, messages, applications, and all other data. This action cannot be undone."
        confirmText="Yes, Delete My Account"
        cancelText="No, Keep It"
        variant="danger"
        isLoading={isLoading}
        requireTyping="DELETE"
      />
    </div>
  );
};

export default Settings;
