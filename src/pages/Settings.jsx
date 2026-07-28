import useAuthStore from "../store/authStore";

const Settings = () => {
  const { logout } = useAuthStore();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold font-heading mb-6">Settings</h1>
      <div className="card bg-base-100 shadow-sm border border-base-300 p-4">
        <h3 className="font-semibold">Account</h3>
        <div className="mt-4 space-y-2">
          <button onClick={logout} className="btn btn-error w-full">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
