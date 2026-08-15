import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import API from "../utils/axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        await API.get(`/auth/verify-email/${token}`);
        setStatus("success");
        setMessage("Email verified successfully! You can now log in.");
      } catch {
        setStatus("error");
        setMessage("Invalid or expired verification link.");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          {status === "loading" && (
            <span className="loading loading-spinner loading-lg text-white"></span>
          )}
          {status === "success" && (
            <CheckCircle className="w-10 h-10 text-white" />
          )}
          {status === "error" && <XCircle className="w-10 h-10 text-white" />}
        </div>
        <h2 className="text-2xl font-bold mb-2">Email Verification</h2>
        <p className="text-base-content/60 mb-6">{message}</p>
        <Link to="/complete-profile" className="btn btn-primary">
          Complete Your Profile
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
