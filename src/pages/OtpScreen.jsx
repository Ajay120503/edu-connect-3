import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, Mail, RefreshCw } from "lucide-react";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const OTP_LENGTH = 6;

const OtpScreen = () => {
  const { verifyOTP, resendOTP, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async () => {
    clearError();
    setIsLoading(true);
    try {
      await verifyOTP(email, otp);
      toast.success("OTP verified successfully!");
      navigate("/complete-profile");
    } catch (err) {
      const message = err.response?.data?.message || "OTP verification failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = otp.substring(0, index) + value + otp.substring(index + 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.length === OTP_LENGTH) {
      setTimeout(() => {
        handleSubmit();
      }, 150);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    try {
      await resendOTP(email);
      toast.success("OTP resent to your email!");
      setResendCooldown(60);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/25">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-neutral mb-1">
            Verify Your Email
          </h1>
          <p className="text-sm text-base-content/50">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-base-content/80">{email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[i] || ""}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-2xl font-bold rounded-xl border-2 border-base-300 focus:border-primary focus:outline-none transition-colors bg-base-100"
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-error text-center mb-4">{error}</p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || otp.length !== OTP_LENGTH}
          className="btn btn-primary w-full h-11 text-sm font-semibold mb-4"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Verify & Continue"
          )}
        </button>

        {/* Resend */}
        <div className="text-center">
          {resendCooldown > 0 ? (
            <p className="text-sm text-base-content/50">
              Resend in {resendCooldown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="btn btn-ghost btn-sm gap-2 text-primary"
            >
              {isResending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              Resend Code
            </button>
          )}
        </div>

        {/* Back to login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-base-content/50 hover:text-base-content/80"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpScreen;
