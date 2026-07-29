import { NavLink } from "react-router-dom";
import {
  Home,
  Compass,
  Briefcase,
  Bookmark,
  User,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import CreatePostModal from "../post/CreatePostModal";
import useAuthStore from "../../store/authStore";

const BottomNav = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { user } = useAuthStore();

  const navItems = [
    { to: "/feed", icon: Home, label: "Home" },
    // { to: "/explore", icon: Compass, label: "Explore" },
    { to: "/jobs", icon: Briefcase, label: "Jobs" },
    { to: "/saved", icon: Bookmark, label: "Saved" },
    { to: `/profile/${user?._id}`, icon: User, label: "Profile" },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100/95 backdrop-blur-md border-t border-base-300/80 z-50 safe-area-bottom shadow-lg">
        <div className="flex items-center justify-around py-1.5">
          {navItems.slice(0, 2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-base-content/40 hover:text-base-content/70"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? "scale-110" : ""
                    }`}
                  />
                  <span className="text-[10px] font-medium leading-tight">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* Center Create Post Button */}
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 -mt-5"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 transition-all">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-medium text-primary leading-tight">
              Post
            </span>
          </button>

          {navItems.slice(2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-base-content/40 hover:text-base-content/70"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? "scale-110" : ""
                    }`}
                  />
                  <span className="text-[10px] font-medium leading-tight">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} />
      )}
    </>
  );
};

export default BottomNav;
