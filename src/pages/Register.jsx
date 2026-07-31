import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Users,
  Briefcase,
  Sparkles,
  Star,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password, role });
      toast.success("Registration successful! Please verify your email.");
      navigate("/feed");
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  const roles = [
    {
      value: "student",
      label: "Student",
      icon: GraduationCap,
      desc: "Pursuing or completed education",
    },
    {
      value: "teacher",
      label: "Teacher",
      icon: Users,
      desc: "Teaching at an institution",
    },
    {
      value: "professor",
      label: "Professor",
      icon: Star,
      desc: "Higher education faculty",
    },
    { value: "hod", label: "HOD", icon: Users, desc: "Head of Department" },
    {
      value: "principal",
      label: "Principal",
      icon: Users,
      desc: "Institution head",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Left Brand Panel — hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-primary relative flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-primary opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />

        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-2xl mb-8 backdrop-blur-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white font-heading mb-4">
            EduConnect
          </h1>
          <p className="text-lg text-white/70 mb-10">
            Where Academic Careers Begin
          </p>

          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">
                Connect with students & teachers worldwide
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">
                Discover teaching roles & research opportunities
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">
                Build your academic career in one place
              </span>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-white/50 text-xs mb-3">Trusted by</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white font-heading">
                  10,000+
                </p>
                <p className="text-[11px] text-white/50">Students</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white font-heading">
                  5,000+
                </p>
                <p className="text-[11px] text-white/50">Teachers</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white font-heading">
                  2,000+
                </p>
                <p className="text-[11px] text-white/50">Job Posts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold font-heading text-neutral mb-1">
              Join EduConnect
            </h1>
            <p className="text-sm text-base-content/50">
              Create your academic profile
            </p>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold font-heading text-neutral mb-2">
              Create Your Account
            </h1>
            <p className="text-sm text-base-content/50">
              Join the academic community today
            </p>
          </div>

          {/* Form */}
          <div className="card bg-base-100 border border-base-300/50 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium text-sm">
                    Full Name
                  </span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 h-11 text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium text-sm">Email</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10 h-11 text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium text-sm">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10 pr-10 h-11 text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content/60"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium text-sm">I am a</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-base-300/50 bg-base-100 text-base-content/50 hover:border-base-300 hover:bg-base-200/50"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? "text-primary" : ""
                          }`}
                        />
                        <span className="font-medium">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full h-11 text-sm font-semibold gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="divider text-xs text-base-content/30 my-5">or</div>

            <p className="text-center text-sm text-base-content/50">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Trust indicators — mobile only */}
          <div className="lg:hidden mt-6 flex items-center justify-center gap-4 text-xs text-base-content/30">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Free
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Secure
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> No ads
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
