import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import ConfirmModal from "../components/common/ConfirmModal";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, logout, deleteAccount, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
