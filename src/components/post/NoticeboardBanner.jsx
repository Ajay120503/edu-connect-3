import { useState, useEffect } from "react";
import { Pin, Clock } from "lucide-react";
import API from "../../utils/axios";

const NoticeboardBanner = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/posts/noticeboard");
        setNotices(data.notices || []);
      } catch {
        /* silently fail */
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading || notices.length === 0) return null;

  const timeRemaining = (expiresAt) => {
    if (!expiresAt) return "";
    const diff = new Date(expiresAt).getTime() - Date.now();
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    if (hrs <= 0) return "expires soon";
    if (hrs < 24) return `${hrs}h remaining`;
    return `${Math.floor(hrs / 24)}d ${hrs % 24}h remaining`;
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Pin className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">
          Notices ({notices.length})
        </span>
      </div>
      <div className="space-y-2">
        {notices.slice(0, 3).map((notice) => (
          <div
            key={notice._id}
            className="card bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 p-3"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 overflow-hidden flex items-center justify-center">
                  {notice.author?.institutionPic?.url ? (
                    <img
                      src={notice.author.institutionPic.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Pin className="w-5 h-5 text-amber-500" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="badge badge-xs badge-warning font-semibold">
                    NOTICE
                  </span>
                  <span className="text-xs text-base-content/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeRemaining(notice.noticeboardExpiresAt)}
                  </span>
                </div>
                <p className="text-sm font-medium">
                  {notice.author?.institutionName || notice.author?.name}
                </p>
                <p className="text-xs text-base-content/70 line-clamp-2 mt-0.5">
                  {notice.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeboardBanner;
