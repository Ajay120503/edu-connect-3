import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import useAuthStore from "./store/authStore";
import { SocketProvider } from "./context/SocketContext";

// Layout Components
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import RightSidebar from "./components/common/RightSidebar";
import BottomNav from "./components/common/BottomNav";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Feed from "./pages/Feed";
import Explore from "./pages/Explore";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import JobApplicants from "./pages/JobApplicants";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import SavedPosts from "./pages/SavedPosts";
import Settings from "./pages/Settings";
import CreateJob from "./pages/CreateJob";
import PostDetail from "./pages/PostDetail";
import NotFound from "./pages/NotFound";

function App() {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          await fetchMe();
        } catch {
          // Invalid token - will redirect to login
        }
      }
      setAppInitialized(true);
    };
    initApp();
  }, [fetchMe]);

  if (!appInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary font-heading">
            EduConnect
          </h1>
          <p className="mt-2 text-base-content/60">
            Where Academic Careers Begin
          </p>
          <div className="mt-4 loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-base-100">
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1E293B",
                color: "#F0F4FF",
                borderRadius: "12px",
              },
            }}
          />

          <Routes>
            {/* Public routes (no layout) */}
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/feed" /> : <Landing />}
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/feed" /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/feed" /> : <Register />}
            />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes (with layout) */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col h-screen overflow-hidden bg-base-100">
                    <Navbar />
                    <div className="flex flex-1 min-h-0">
                      <Sidebar />
                      <main className="flex-1 overflow-y-auto pb-[70px] md:pb-0 scroll-smooth">
                        <Routes>
                          <Route path="/feed" element={<Feed />} />
                          <Route path="/explore" element={<Explore />} />
                          <Route path="/jobs" element={<Jobs />} />
                          <Route path="/jobs/create" element={<CreateJob />} />
                          <Route path="/jobs/:id" element={<JobDetail />} />
                          <Route
                            path="/jobs/:id/applicants"
                            element={<JobApplicants />}
                          />
                          <Route path="/profile/:id" element={<Profile />} />
                          <Route
                            path="/edit-profile"
                            element={<EditProfile />}
                          />
                          <Route path="/chat" element={<Chat />} />
                          <Route path="/chat/:id" element={<Chat />} />
                          <Route
                            path="/notifications"
                            element={<Notifications />}
                          />
                          <Route path="/saved" element={<SavedPosts />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/post/:id" element={<PostDetail />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <RightSidebar />
                    </div>
                    <BottomNav />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
