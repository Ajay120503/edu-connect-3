import useAuthStore from "../../store/authStore";

const SkillGapBar = ({ job }) => {
  const { user } = useAuthStore();
  if (!user || !job?.skillsRequired?.length) return null;

  const studentSkills = (user.skills || []).map((s) => s.toLowerCase().trim());
  const jobSkills = job.skillsRequired.map((s) => s.toLowerCase().trim());

  const matchedSkills = jobSkills.filter((s) => studentSkills.includes(s));
  const missingSkills = jobSkills.filter((s) => !studentSkills.includes(s));
  const matchPercent = Math.round(
    (matchedSkills.length / jobSkills.length) * 100
  );

  return (
    <div className="skill-gap-section mt-4 p-4 bg-base-200/50 rounded-lg">
      <p className="text-sm font-semibold mb-2">
        You match {matchedSkills.length}/{jobSkills.length} skills (
        {matchPercent}%)
      </p>
      <progress
        className="progress progress-success w-full"
        value={matchedSkills.length}
        max={jobSkills.length}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        {matchedSkills.map((s) => (
          <span key={s} className="badge badge-success badge-sm">
            ✓ {s}
          </span>
        ))}
        {missingSkills.map((s) => (
          <span key={s} className="badge badge-error badge-outline badge-sm">
            ✗ {s}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillGapBar;
