import {
  Award,
  Briefcase,
  FileText,
  Megaphone,
  Sparkles,
} from "lucide-react";

export const postTypes = [
  {
    value: "general",
    label: "General",
    icon: FileText,
  },
  {
    value: "job",
    label: "Job",
    icon: Briefcase,
  },
  {
    value: "announcement",
    label: "Announcement",
    icon: Megaphone,
  },
  {
    value: "achievement",
    label: "Achievement",
    icon: Award,
  },
  {
    value: "noticeboard",
    label: "Notice",
    icon: Sparkles,
    requiresInstitution: true,
  },
];

export const getAvailablePostTypes = (user) =>
  user ? postTypes : postTypes.filter((type) => !type.requiresInstitution);
