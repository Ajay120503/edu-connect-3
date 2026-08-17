import { getUserSignal } from "../../utils/userSignals";

const sizeClasses = {
  xs: "badge-xs text-[10px]",
  sm: "badge-sm text-[10px]",
};

const UserSignalBadge = ({ user, size = "xs", className = "" }) => {
  const signal = getUserSignal(user);
  if (!signal) return null;

  return (
    <span
      className={`badge font-semibold ${sizeClasses[size] || sizeClasses.xs} ${
        signal.className
      } ${className}`}
    >
      {signal.label}
    </span>
  );
};

export default UserSignalBadge;
