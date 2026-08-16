import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Upload } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import BadgeChip from "../components/common/BadgeChip";
import useAuthStore from "../store/authStore";
import { SELF_BADGES, BADGE_GROUPS } from "../utils/badgeUtils";
import API from "../utils/axios";
import toast from "react-hot-toast";

const steps = [
  { key: "badges", label: "Who are you?" },
  { key: "details", label: "Your details" },
  { key: "education", label: "Education & skills" },
  { key: "institution", label: "Your institution" },
];

/**
 * 4-step Profile Completion Wizard.
 * Appears after OTP/email verification — user selects badges + fills profile.
 */
const CompleteProfile = () => {
  const { user, updateBadges, updateProfile, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    institutionName: user?.institutionName || "",
    institutionType: user?.institutionType || "",
    skills: user?.skills?.join(", ") || "",
    qualifications: user?.qualifications?.join(", ") || "",
    educationLevel: user?.educationLevel || "",
    subject: user?.subject || "",
    experience: user?.experience || 0,
    profession: user?.profession || "",
    linkedinUrl: user?.linkedinUrl || "",
    profilePic: null,
  });

  const [selectedBadges, setSelectedBadges] = useState(
    user?.badges
      ?.filter((b) => b.isActive && SELF_BADGES.includes(b.type))
      .map((b) => b.type) || [],
  );

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(
    user?.profilePic?.url || "",
  );

  // If user already has badges and is verified, skip wizard
  useEffect(() => {
    if (
      user?.isVerified &&
      user?.badges?.length > 0 &&
      selectedBadges.length > 0
    ) {
      navigate("/feed");
    }
  }, [user, navigate, selectedBadges.length]);

  // ── Badge selection ──
  const onBadgeSelect = (badgeType) => {
    setSelectedBadges((prev) =>
      prev.includes(badgeType)
        ? prev.filter((b) => b !== badgeType)
        : [...prev, badgeType],
    );
  };

  // ── Profile pic upload ──
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePicFile(file);
    setProfilePicPreview(URL.createObjectURL(file));
  };

  // ── Form handlers ──
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedBadges.length === 0) {
      toast.error("Please select at least one badge to continue.");
      return;
    }

    setLoading(true);
    try {
      // 1. Save profile data via /api/users/:id (multipart for profile pic)
      const profileFormData = new FormData();
      profileFormData.append("name", user?.name || "");
      profileFormData.append("bio", formData.bio);
      profileFormData.append("address", formData.address);
      profileFormData.append("city", formData.city);
      profileFormData.append("state", formData.state);
      profileFormData.append("institutionName", formData.institutionName);
      profileFormData.append("skills", formData.skills);
      profileFormData.append("qualifications", formData.qualifications);
      profileFormData.append("educationLevel", formData.educationLevel);
      profileFormData.append("subject", formData.subject);
      profileFormData.append("experience", formData.experience);
      profileFormData.append("profession", formData.profession);
      profileFormData.append("linkedinUrl", formData.linkedinUrl);

      if (profilePicFile) {
        profileFormData.append("profilePic", profilePicFile);
      }

      const { data: profileData } = await API.put(
        `/users/${user._id}`,
        profileFormData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (profileData.user) {
        setUser(profileData.user);
      }

      // 2. Save self-selected badges
      await updateBadges(selectedBadges);

      toast.success("Profile completed successfully!");
      navigate("/feed");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to complete profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, idx) => (
        <>
          <div key={s.key} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                idx === step
                  ? "bg-primary border-primary text-white"
                  : idx < step
                    ? "bg-primary border-primary text-white"
                    : "border-base-300 text-base-content/50"
              }`}
            >
              {idx < step ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-bold">{idx + 1}</span>
              )}
            </div>
            <span className="text-xs mt-1.5 text-center">{s.label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 transition-colors ${
                idx < step ? "bg-primary" : "bg-base-300"
              }`}
            />
          )}
        </>
      ))}
    </div>
  );

  // ── Step 1: Badge Selection ──
  const renderBadgesStep = () => (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">Who are you?</h2>
        <p className="text-sm text-base-content/60">
          Select all badges that describe you (you can change these later)
        </p>
      </div>

      <div className="space-y-6">
        {BADGE_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="text-xs font-semibold text-base-content/50 uppercase mb-3">
              {group.label}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {group.badges.map((badgeType) => (
                <div
                  key={badgeType}
                  onClick={() => onBadgeSelect(badgeType)}
                  className={`cursor-pointer rounded-xl p-3 transition-all border-2 text-center ${
                    selectedBadges.includes(badgeType)
                      ? "border-primary bg-primary/5"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    {selectedBadges.includes(badgeType) && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                    <BadgeChip badgeType={badgeType} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (selectedBadges.length === 0) {
            toast.error("Please select at least one badge.");
            return;
          }
          nextStep();
        }}
        className="btn btn-primary w-full mt-6"
        disabled={selectedBadges.length === 0}
      >
        Continue
      </button>
    </div>
  );

  // ── Step 2: Details ──
  const renderDetailsStep = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-4">Your details</h2>

      {/* Profile picture */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-base-200">
            {profilePicPreview ? (
              <img
                src={profilePicPreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base-content/20">
                <FontAwesomeIcon icon={faUserGraduate} className="w-8 h-8" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 btn btn-xs btn-circle btn-ghost">
            <Upload className="w-3 h-3" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </label>
        </div>
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">Bio</span>
        </label>
        <textarea
          rows={3}
          className="textarea textarea-bordered w-full text-sm"
          placeholder="Tell us about yourself..."
          maxLength={200}
          value={formData.bio}
          onChange={(e) => updateField("bio", e.target.value)}
        />
        <span className="label-text-alt text-base-content/40">
          {formData.bio.length}/200
        </span>
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">Address</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full input-sm"
          placeholder="Street, Locality"
          value={formData.address}
          onChange={(e) => updateField("address", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text font-medium text-sm">City</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full input-sm"
            placeholder="City"
            value={formData.city}
            onChange={(e) => updateField("city", e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text font-medium text-sm">State</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full input-sm"
            placeholder="State"
            value={formData.state}
            onChange={(e) => updateField("state", e.target.value)}
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">LinkedIn URL</span>
        </label>
        <input
          type="url"
          className="input input-bordered w-full input-sm"
          placeholder="https://linkedin.com/in/yourprofile"
          value={formData.linkedinUrl}
          onChange={(e) => updateField("linkedinUrl", e.target.value)}
        />
      </div>
    </div>
  );

  // ── Step 3: Education & Skills ──
  const renderEducationStep = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-4">Education & skills</h2>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">
            Education Level
          </span>
        </label>
        <select
          className="select select-bordered w-full select-sm"
          value={formData.educationLevel}
          onChange={(e) => updateField("educationLevel", e.target.value)}
        >
          <option value="">Select</option>
          <option value="10th">10th</option>
          <option value="12th">12th</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="postgraduate">Postgraduate</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">Subject</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full input-sm"
          placeholder="e.g. Computer Science"
          value={formData.subject}
          onChange={(e) => updateField("subject", e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">
            Skills (comma separated)
          </span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full input-sm"
          placeholder="e.g. Python, Teaching, React"
          value={formData.skills}
          onChange={(e) => updateField("skills", e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">
            Qualifications (comma separated)
          </span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full input-sm"
          placeholder="e.g. B.Tech, M.Sc"
          value={formData.qualifications}
          onChange={(e) => updateField("qualifications", e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">
            Experience (years)
          </span>
        </label>
        <input
          type="number"
          className="input input-bordered w-full input-sm"
          placeholder="0"
          min="0"
          value={formData.experience}
          onChange={(e) =>
            updateField("experience", parseInt(e.target.value) || 0)
          }
        />
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">Profession</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full input-sm"
          placeholder="e.g. Part-time Tutor"
          value={formData.profession}
          onChange={(e) => updateField("profession", e.target.value)}
        />
      </div>
    </div>
  );

  // ── Step 4: Institution ──
  const renderInstitutionStep = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-2">Your institution (optional)</h2>
      <p className="text-sm text-base-content/60 mb-4">
        This helps others identify your academic background.
      </p>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">
            Institution Type
          </span>
        </label>
        <select
          className="select select-bordered w-full select-sm"
          value={formData.institutionType}
          onChange={(e) => updateField("institutionType", e.target.value)}
        >
          <option value="">Select institution type</option>
          <option value="school">School</option>
          <option value="college">College</option>
          <option value="university">University</option>
          <option value="coaching">Coaching Center</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-medium text-sm">
            Institution Name
          </span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full input-sm"
          placeholder="e.g. Example University"
          value={formData.institutionName}
          onChange={(e) => updateField("institutionName", e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 flex">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-3">
              <FontAwesomeIcon
                icon={faUserGraduate}
                className="w-8 h-8 text-white"
                fontSize={24}
              />
            </div>
            <h1 className="text-2xl font-bold font-heading mb-1">
              Complete Your Profile
            </h1>
            <p className="text-sm text-base-content/50">
              {selectedBadges.length} badge
              {selectedBadges.length !== 1 ? "s" : ""} selected • Step{" "}
              {step + 1} of {steps.length}
            </p>
          </div>

          {/* Progress indicator */}
          {renderStepIndicator()}

          {/* Step content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 0 && renderBadgesStep()}
            {step === 1 && renderDetailsStep()}
            {step === 2 && renderEducationStep()}
            {step === 3 && renderInstitutionStep()}
          </form>

          {/* Selected badges preview (bottom of wizard) */}
          {selectedBadges.length > 0 && (
            <div className="mt-4 p-3 bg-base-200/50 rounded-xl">
              <p className="text-xs text-base-content/50 mb-2">
                Your selected badges:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedBadges.map((b) => (
                  <BadgeChip key={b} badgeType={b} size="sm" />
                ))}
              </div>
            </div>
          )}

          {/* Navigation (shown on steps 2-4, step 1 has its own button) */}
          {step > 0 && (
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-ghost btn-outline flex-1"
              >
                ← Previous
              </button>
              {step === steps.length - 1 ? (
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Complete Profile →"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary flex-1"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
