import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LifeBuoy,
  LogOut,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "../store/authStore";

const BlockedScreen = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <header className="h-16 border-b border-base-300/70 bg-base-100/95 backdrop-blur">
        <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <FontAwesomeIcon
                icon={faUserGraduate}
                className="w-5 h-5 text-primary-content"
              />
            </div>
            <span className="text-lg font-bold text-primary">EduConnect</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <section className="w-full max-w-xl">
          <div className="card bg-base-100 border border-error/20 shadow-sm">
            <div className="card-body p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-14 h-14 rounded-xl bg-error/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-7 h-7 text-error" />
                </div>
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-error/10 text-error px-2.5 py-1 text-xs font-semibold mb-3">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Access paused
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold font-heading text-neutral mb-2">
                    Account Suspended
                  </h1>

                  <p className="text-sm text-base-content/60 leading-relaxed">
                    Your account is currently suspended
                    {user?.blockedReason ? " for the reason below" : ""}. If
                    you believe this was a mistake, contact support and include
                    the email linked to your EduConnect account.
                  </p>

                  <div className="mt-5 space-y-3">
                    {user?.blockedReason && (
                      <div className="rounded-lg border border-error/20 bg-error/5 p-4">
                        <p className="text-xs font-semibold text-error mb-1">
                          Suspension reason
                        </p>
                        <p className="text-sm text-base-content/75">
                          {user.blockedReason}
                        </p>
                      </div>
                    )}

                    {user?.adminNotes && (
                      <div className="rounded-lg border border-base-300 bg-base-200/50 p-4">
                        <p className="text-xs font-semibold text-base-content/50 mb-1">
                          Admin note
                        </p>
                        <p className="text-sm text-base-content/70">
                          {user.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <a
                      href="mailto:support@educonnect.in"
                      className="btn btn-primary gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Support
                    </a>
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline btn-error gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>

                  <button
                    onClick={() => navigate("/login")}
                    className="btn btn-ghost btn-sm gap-2 mt-4 px-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-base-content/40">
            <LifeBuoy className="w-3.5 h-3.5" />
            EduConnect support usually reviews account appeals manually.
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlockedScreen;
