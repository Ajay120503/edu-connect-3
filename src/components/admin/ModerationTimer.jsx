import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

/**
 * Shows a countdown timer for auto-moderation decisions.
 * When `initialSeconds` reaches 0, `onExpire` is called.
 *
 * @param {number} initialSeconds - starting countdown
 * @param {function} onExpire - callback when timer hits 0
 * @param {boolean} [autoApprove=true] - whether expiry means auto-approve
 */
const ModerationTimer = ({
  initialSeconds = 30,
  onExpire,
  autoApprove = true,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire();
      return;
    }
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, onExpire]);

  const actionLabel = autoApprove ? "approved" : "rejected";

  return (
    <div className="flex items-center gap-2 text-xs text-base-content/50">
      <Clock className="w-3 h-3" />
      <span>
        Auto-{actionLabel} in {seconds}s
      </span>
    </div>
  );
};

export default ModerationTimer;
