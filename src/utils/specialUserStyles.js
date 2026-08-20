import { getUserSignal, isPlatformAdmin } from "./userSignals";
import { userHasBadge } from "./badgeUtils";

export const SPECIAL_STYLE_VARIANTS = [
  {
    value: "teal",
    label: "Academic Teal",
    swatch: "bg-primary",
  },
  {
    value: "coral",
    label: "Coral",
    swatch: "bg-accent",
  },
  {
    value: "emerald",
    label: "Emerald",
    swatch: "bg-success",
  },
  {
    value: "amber",
    label: "Amber",
    swatch: "bg-warning",
  },
  {
    value: "indigo",
    label: "Indigo",
    swatch: "bg-[#5667d8]",
  },
];

export const canUseSpecialStyle = (user) => {
  if (!user) return false;
  const signal = getUserSignal(user);
  return Boolean(
    isPlatformAdmin(user) ||
      signal?.key === "popular" ||
      signal?.key === "active" ||
      userHasBadge(user, "top_contributor") ||
      user?.verifiedStatus === "top_contributor"
  );
};

const variants = {
  teal: {
    shell:
      "bg-primary/8 text-base-content border-primary/25 shadow-sm shadow-primary/10",
    shellHover: "hover:border-primary/40 hover:shadow-primary/15",
    label: "badge-primary badge-soft",
    soft: "bg-primary/10 text-primary border-primary/20",
    muted: "text-primary/75",
    ring: "ring-2 ring-primary ring-offset-2 ring-offset-base-100",
    storyRing: "bg-primary",
    icon: "text-primary",
  },
  coral: {
    shell:
      "bg-accent/8 text-base-content border-accent/25 shadow-sm shadow-accent/10",
    shellHover: "hover:border-accent/40 hover:shadow-accent/15",
    label: "bg-accent/12 text-accent border-accent/25",
    soft: "bg-accent/10 text-accent border-accent/20",
    muted: "text-accent/80",
    ring: "ring-2 ring-accent ring-offset-2 ring-offset-base-100",
    storyRing: "bg-accent",
    icon: "text-accent",
  },
  emerald: {
    shell:
      "bg-success/8 text-base-content border-success/25 shadow-sm shadow-success/10",
    shellHover: "hover:border-success/40 hover:shadow-success/15",
    label: "badge-success badge-soft",
    soft: "bg-success/10 text-success border-success/20",
    muted: "text-success/80",
    ring: "ring-2 ring-success ring-offset-2 ring-offset-base-100",
    storyRing: "bg-success",
    icon: "text-success",
  },
  amber: {
    shell:
      "bg-warning/10 text-base-content border-warning/30 shadow-sm shadow-warning/10",
    shellHover: "hover:border-warning/50 hover:shadow-warning/15",
    label: "badge-warning badge-soft",
    soft: "bg-warning/12 text-warning border-warning/25",
    muted: "text-warning/85",
    ring: "ring-2 ring-warning ring-offset-2 ring-offset-base-100",
    storyRing: "bg-warning",
    icon: "text-warning",
  },
  indigo: {
    shell:
      "bg-[#eef0ff] text-base-content border-[#c6ccff] shadow-sm shadow-[#5667d8]/10",
    shellHover: "hover:border-[#9ca6f7] hover:shadow-[#5667d8]/15",
    label: "bg-[#e4e7ff] text-[#3847ad] border-[#b7bef6]",
    soft: "bg-[#e4e7ff] text-[#3847ad] border-[#b7bef6]",
    muted: "text-[#5360ba]",
    ring: "ring-2 ring-[#5667d8] ring-offset-2 ring-offset-base-100",
    storyRing: "bg-[#5667d8]",
    icon: "text-[#5667d8]",
  },
};

export const getSpecialStyleVariant = (user) => {
  const requested = user?.profileThemeVariant;
  if (canUseSpecialStyle(user) && variants[requested]) return requested;
  if (isPlatformAdmin(user)) return "indigo";
  return "teal";
};

export const getSpecialUserStyle = (user) =>
  variants[getSpecialStyleVariant(user)] || variants.teal;
