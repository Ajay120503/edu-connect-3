/**
 * Badge configuration — maps each badge type to display metadata.
 * Used by BadgeChip and the badge selection wizard.
 *
 * Trust badges (verified_institution, top_contributor, email_verified,
 * phone_verified) are SYSTEM/ADMIN only — users cannot self-assign them.
 */

import {
  GraduationCap,
  BookOpen,
  School,
  Users,
  FlaskConical,
  Microscope,
  BadgeCheck,
  Star,
  Mail,
  Phone,
  Award,
  Globe,
  Library,
  UserCheck,
  // ClipboardText,
  Sparkles,
  Dumbbell,
  Palette,
  Stethoscope,
} from "lucide-react";

/**
 * Map icon name strings → Lucide React components.
 * BadgeChip and BadgeSelector use this to render the correct icon.
 */
export const badgeIconMap = {
  GraduationCap,
  BookOpen,
  School,
  Users,
  FlaskConical,
  Microscope,
  BadgeCheck,
  Star,
  Mail,
  Phone,
  Award,
  Globe,
  Library,
  UserCheck,
  // ClipboardText,
  Sparkles,
  Dumbbell,
  Palette,
  Stethoscope,
};

export const badgeConfig = {
  // ── Academic identity ──
  student: {
    label: "Student",
    bg: "#E8F0FE",
    text: "#1E429F",
    icon: "GraduationCap",
  },
  teacher: {
    label: "Teacher",
    bg: "#CFFAFE",
    text: "#155E75",
    icon: "BookOpen",
  },
  professor: {
    label: "Professor",
    bg: "#CFFAFE",
    text: "#155E75",
    icon: "BookOpen",
  },
  principal: {
    label: "Principal",
    bg: "#1A56DB",
    text: "#FFFFFF",
    icon: "School",
  },
  hod: {
    label: "HOD",
    bg: "#1A56DB",
    text: "#FFFFFF",
    icon: "Users",
  },
  researcher: {
    label: "Researcher",
    bg: "#EDE9FE",
    text: "#4C1D95",
    icon: "FlaskConical",
  },
  phd_scholar: {
    label: "PhD Scholar",
    bg: "#EDE9FE",
    text: "#4C1D95",
    icon: "Microscope",
  },
  lecturer: {
    label: "Lecturer",
    bg: "#CFFAFE",
    text: "#155E75",
    icon: "BookOpen",
  },
  // ── Institution type ──
  school_member: {
    label: "School Member",
    bg: "#EDE9FE",
    text: "#4C1D95",
    icon: "Library",
  },
  college_member: {
    label: "College Member",
    bg: "#EDE9FE",
    text: "#4C1D95",
    icon: "School",
  },
  university_member: {
    label: "University Member",
    bg: "#EDE9FE",
    text: "#4C1D95",
    icon: "GraduationCap",
  },
  coaching_member: {
    label: "Coaching Member",
    bg: "#EDE9FE",
    text: "#4C1D95",
    icon: "ClipboardText",
  },
  // ── Skills / domain ──
  stem_expert: {
    label: "STEM Expert",
    bg: "#DCFCE7",
    text: "#14532D",
    icon: "Sparkles",
  },
  arts_expert: {
    label: "Arts Expert",
    bg: "#F3E8FF",
    text: "#581C87",
    icon: "Palette",
  },
  sports_coach: {
    label: "Sports Coach",
    bg: "#FEF3C7",
    text: "#92400E",
    icon: "Dumbbell",
  },
  counselor: {
    label: "Counselor",
    bg: "#DCFCE7",
    text: "#14532D",
    icon: "Stethoscope",
  },
  // ── Trust (admin/system only) ──
  verified_institution: {
    label: "Verified Institution",
    bg: "#1A56DB",
    text: "#FFFFFF",
    icon: "BadgeCheck",
  },
  top_contributor: {
    label: "Top Contributor",
    bg: "#FEF3C7",
    text: "#92400E",
    icon: "Star",
  },
  email_verified: {
    label: "Email Verified",
    bg: "#D1FAE5",
    text: "#065F46",
    icon: "Mail",
  },
  phone_verified: {
    label: "Phone Verified",
    bg: "#D1FAE5",
    text: "#065F46",
    icon: "Phone",
  },
};

export default badgeConfig;
