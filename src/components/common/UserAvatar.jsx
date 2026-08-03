/**
 * Reusable avatar component that shows a green ring + badge indicator
 * when the user has "Open to Opportunities" enabled.
 *
 * Props:
 * - user: { name, profilePic: { url }, openToOpportunities }
 * - size: pixel size of the avatar (default 40)
 * - className: additional classes for the wrapper
 * - showIndicator: whether to show the green "open to opportunities" indicator (default true)
 * - ringClass: custom ring classes to override the default indicator ring
 */
const UserAvatar = ({
  user,
  size = 40,
  className = "",
  showIndicator = true,
  ringClass = "",
}) => {
  const isOpen = showIndicator && user?.openToOpportunities;
  const name = user?.name || "U";
  const initial = name.charAt(0)?.toUpperCase() || "U";
  const profilePic = user?.profilePic;
  const imgUrl =
    typeof profilePic === "string" ? profilePic : profilePic?.url || "";

  const baseRing = isOpen
    ? "ring-2 ring-success ring-offset-2 ring-offset-base-100"
    : "ring-2 ring-base-100";

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={isOpen ? `${name} is open to opportunities` : undefined}
    >
      <div
        className={`w-full h-full rounded-full bg-placeholder overflow-hidden shadow-sm ${
          ringClass || baseRing
        }`}
      >
        {imgUrl ? (
          <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-base-content/40 font-bold"
            style={{ fontSize: Math.max(size * 0.4, 10) }}
          >
            {initial}
          </div>
        )}
      </div>

      {/* Green "Open to Opportunities" badge */}
      {isOpen && (
        <span
          className="absolute bottom-0 right-0 bg-success rounded-full border-2 border-base-100"
          style={{
            width: Math.max(size * 0.28, 8),
            height: Math.max(size * 0.28, 8),
          }}
          title="Open to opportunities"
        />
      )}
    </div>
  );
};

export default UserAvatar;
