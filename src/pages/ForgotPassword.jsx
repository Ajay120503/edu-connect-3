import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail } from "lucide-react";
import API from "../utils/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("OTP sent to your email!");
    } catch {
      toast.error("Error sending OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Reset Password</h1>
          <p className="text-base-content/60 mt-1">
            {sent
              ? "Check your email for the OTP"
              : "Enter your email to receive an OTP"}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-2">
              <Mail className="w-4 h-4 text-base-content/40" />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn btn-primary w-full">
              Send OTP
            </button>
          </form>
        ) : (
          <div className="text-center">
            <Link to="/reset-password" className="btn btn-primary">
              Enter OTP
            </Link>
          </div>
        )}

        <p className="text-center mt-6 text-sm text-base-content/60">
          <Link to="/login" className="text-primary hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
