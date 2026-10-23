/**
 * Porikkhaloy Design System Color Palette
 * Primary: Cobalt Blue (#2455D6) & Royal Violet (#783CE7)
 * Accent: Electric Lime (#B9F227)
 */

export const colors = {
  // Brand Colors
  primary: "#2455D6",        // Cobalt Blue
  primaryDark: "#183BB0",
  primaryLight: "#EDF2FE",
  
  secondary: "#783CE7",      // Royal Violet
  secondaryDark: "#5E29BE",
  secondaryLight: "#F3EEFE",

  accent: "#B9F227",         // Electric Lime
  accentDark: "#94C719",
  accentLight: "#F6FDE8",

  // Feedback & Status
  success: "#10B981",
  successLight: "#ECFDF5",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  info: "#0284C7",
  infoLight: "#F0F9FF",

  // Neutrals / Surfaces
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceSecondary: "#F1F5F9",
  card: "#FFFFFF",
  cardBorder: "#E2E8F0",
  
  // Text
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textInverted: "#FFFFFF",

  // Interactive
  border: "#E2E8F0",
  divider: "#EDF2F7",
  backdrop: "rgba(15, 23, 42, 0.6)",
  
  // Gradients
  gradientPrimary: ["#2455D6", "#783CE7"] as const,
  gradientHero: ["#183BB0", "#2455D6", "#783CE7"] as const,
  gradientAccent: ["#B9F227", "#84CC16"] as const,
  gradientDark: ["#0F172A", "#1E293B"] as const,
};

export const darkColors = {
  primary: "#3B82F6",
  primaryDark: "#2455D6",
  primaryLight: "#1E293B",
  
  secondary: "#8B5CF6",
  secondaryDark: "#783CE7",
  secondaryLight: "#2D1F47",

  accent: "#B9F227",
  accentDark: "#94C719",
  accentLight: "#29380F",

  success: "#34D399",
  successLight: "#064E3B",
  warning: "#FBBF24",
  warningLight: "#78350F",
  danger: "#F87171",
  dangerLight: "#7F1D1D",
  info: "#38BDF8",
  infoLight: "#0C4A6E",

  background: "#090D16",
  surface: "#111827",
  surfaceSecondary: "#1F2937",
  card: "#161F30",
  cardBorder: "#27354E",
  
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  textInverted: "#0F172A",

  border: "#27354E",
  divider: "#1E293B",
  backdrop: "rgba(0, 0, 0, 0.75)",

  gradientPrimary: ["#2455D6", "#783CE7"] as const,
  gradientHero: ["#0F172A", "#183BB0", "#783CE7"] as const,
  gradientAccent: ["#B9F227", "#84CC16"] as const,
  gradientDark: ["#090D16", "#161F30"] as const,
};
