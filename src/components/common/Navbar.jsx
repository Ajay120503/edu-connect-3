import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Search,
  Bell,
  MessageCircle,
  LogOut,
  User,
  Settings,
  GraduationCap,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { useSocket } from "../../context/SocketContext";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { notificationCount, messageCount } = useSocket();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="hidden md:flex items-center justify-between px-4 lg:px-6 py-2.5 bg-base-100/95 backdrop-blur-md border-b border-base-300/80 sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link to="/feed" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm">
          <GraduationCap className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-heading hidden lg:block">
          EduConnect
        </span>
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
        <label className="input input-bordered flex items-center gap-2 rounded-full">
          <Search className="w-4 h-4 text-base-content/40" />
          <input
            type="text"
            className="grow"
            placeholder="Search users, jobs, posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </form>

      {/* Right Icons */}
      <div className="flex items-center gap-1">
        <Link
          to="/notifications"
          className="btn btn-ghost btn-circle btn-sm hover:bg-primary/10 relative"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>
        <Link
          to="/chat"
          className="btn btn-ghost btn-circle btn-sm hover:bg-primary/10 relative"
        >
          <MessageCircle className="w-5 h-5" />
          {messageCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {messageCount > 9 ? "9+" : messageCount}
            </span>
          )}
        </Link>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle btn-sm avatar hover:bg-primary/10"
          >
            <div className="w-8 rounded-full ring-2 ring-primary/20">
              {user?.profilePic?.url ? (
                <img
                  src={user.profilePic.url}
                  alt={user.name}
                  className="rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-xl border border-base-300/50 w-52 mt-2"
          >
            <li>
              <Link
                to={`/profile/${user?._id}`}
                className="flex items-center gap-2 py-2"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center gap-2 py-2">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="flex items-center gap-2 py-2 text-error hover:text-error/80"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
