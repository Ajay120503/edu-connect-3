import {
  Plus,
  GraduationCap,
  Building2,
  Briefcase,
  Trophy,
} from "lucide-react";

const typeConfig = {
  school: { icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
  college: {
    icon: Building2,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  work: { icon: Briefcase, color: "text-teal-500", bg: "bg-teal-50" },
  achievement: {
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
};

const AcademicTimeline = ({ timeline, isOwner, onAddEntry }) => {
  if (!timeline || timeline.length === 0) {
    if (!isOwner) return null;
    return (
      <div className="mt-4 p-4 bg-base-200/30 rounded-lg text-center">
        <p className="text-sm text-base-content/40">
          No academic timeline entries yet.
        </p>
        {onAddEntry && (
          <button
            onClick={onAddEntry}
            className="btn btn-ghost btn-xs gap-1 mt-2"
          >
            <Plus className="w-3 h-3" /> Add Entry
          </button>
        )}
      </div>
    );
  }

  const sorted = [...timeline].sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    return yearB - yearA;
  });

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        Academic Journey
        {isOwner && onAddEntry && (
          <button
            onClick={onAddEntry}
            className="btn btn-ghost btn-xs gap-1 ml-auto"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </h3>
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-base-300 rounded-full" />

        {sorted.map((entry, idx) => {
          const config = typeConfig[entry.type] || typeConfig.school;
          const Icon = config.icon;
          return (
            <div key={idx} className="relative pb-4 last:pb-0">
              {/* Node */}
              <div
                className={`absolute -left-6 top-1 w-6 h-6 rounded-full ${config.bg} flex items-center justify-center border-2 border-base-100`}
              >
                <Icon className={`w-3 h-3 ${config.color}`} />
              </div>
              <div>
                <span className="text-xs font-bold text-base-content/50">
                  {entry.year}
                </span>
                <p className="text-sm font-medium">{entry.title}</p>
                {entry.institution && (
                  <p className="text-xs text-base-content/50">
                    {entry.institution}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicTimeline;
