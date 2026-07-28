import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Compass,
  Briefcase,
  Bookmark,
  User,
  PlusCircle,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import CreatePostModal from "../post/CreatePostModal";

const Sidebar = () => {
  const { user } = useAuthStore();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const navItems = [
    { to: "/feed", icon: Home, label: "Feed" },
    { to: "/explore", icon: Compass, label: "Explore" },
    { to: "/jobs", icon: Briefcase, label: "Jobs" },
    { to: "/saved", icon: Bookmark, label: "Saved" },
    { to: `/profile/${user?._id}`, icon: User, label: "Profile" },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-base-100 border-r border-base-300 p-4 sticky top-16 h-[calc(100vh-4rem)]">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-base-content/70 hover:bg-base-200"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Create Post Button */}
        <button
          className="btn btn-primary mt-4 w-full shadow-lg shadow-primary/20"
          onClick={() => setShowCreatePost(true)}
        >
          <PlusCircle className="w-5 h-5" />
          Create Post
        </button>

        {/* User info at bottom */}
        <div className="mt-auto pt-4 border-t border-base-300">
          <NavLink
            to={`/profile/${user?._id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex-shrink-0">
              {user?.profilePic?.url ? (
                <img
                  src={user.profilePic.url}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-base-content/50 truncate">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </p>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Create Post Modal (state-based, shared across layout) */}
      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} />
      )}
    </>
  );
};

export default Sidebar;
