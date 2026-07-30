import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calcStrength, getIncompleteFields } from "../../utils/profileStrength";

const StrengthMeter = ({ user }) => {
  const navigate = useNavigate();
  const [animatedScore, setAnimatedScore] = useState(0);
  const score = calcStrength(user);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = () => {
    if (score >= 71) return "text-success stroke-success";
    if (score >= 41) return "text-warning stroke-warning";
    return "text-error stroke-error";
  };

  const incompleteFields = getIncompleteFields(user);

  return (
    <div className="card bg-base-100 border border-base-300/50 p-4">
      <h3 className="font-semibold text-sm mb-3">Profile Strength</h3>
      <div className="flex items-center gap-4">
        {/* Circular ring */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-base-300"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              className={getColor()}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
                transition: "stroke-dashoffset 1s ease-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${getColor()}`}>
              {animatedScore}%
            </span>
          </div>
        </div>

        {/* Incomplete fields checklist */}
        <div className="flex-1 min-w-0">
          {incompleteFields.length > 0 ? (
            <ul className="space-y-1">
              {incompleteFields.slice(0, 3).map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="text-xs text-base-content/60 hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-error"></span>
                    {item.label}
                  </button>
                </li>
              ))}
              {incompleteFields.length > 3 && (
                <li>
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="text-xs text-primary hover:underline"
                  >
                    +{incompleteFields.length - 3} more
                  </button>
                </li>
              )}
            </ul>
          ) : (
            <p className="text-xs text-success font-medium">
              Profile complete!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrengthMeter;
