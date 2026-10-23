import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "../theme/colors";
import { radii, spacing } from "../theme/spacing";
import { fontFamilies } from "../theme/typography";

export interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  size = "md",
  style,
}) => {
  const getContainerStyle = (): ViewStyle => {
    let bg = colors.primaryLight;
    let border = colors.primary;

    switch (variant) {
      case "primary":
        bg = colors.primaryLight;
        border = colors.primary;
        break;
      case "secondary":
        bg = colors.secondaryLight;
        border = colors.secondary;
        break;
      case "accent":
        bg = colors.accentLight;
        border = colors.accentDark;
        break;
      case "success":
        bg = colors.successLight;
        border = colors.success;
        break;
      case "warning":
        bg = colors.warningLight;
        border = colors.warning;
        break;
      case "danger":
        bg = colors.dangerLight;
        border = colors.danger;
        break;
      case "neutral":
        bg = colors.surfaceSecondary;
        border = colors.border;
        break;
    }

    return {
      backgroundColor: bg,
      borderColor: border,
      borderWidth: 1,
      borderRadius: radii.full,
      paddingHorizontal: size === "sm" ? spacing.sm : spacing.md,
      paddingVertical: size === "sm" ? 2 : 4,
      alignSelf: "flex-start",
      alignItems: "center",
      justifyContent: "center",
    };
  };

  const getTextStyle = (): TextStyle => {
    let textColor = colors.primary;
    switch (variant) {
      case "primary":
        textColor = colors.primary;
        break;
      case "secondary":
        textColor = colors.secondary;
        break;
      case "accent":
        textColor = "#4D6B00";
        break;
      case "success":
        textColor = colors.success;
        break;
      case "warning":
        textColor = "#B45309";
        break;
      case "danger":
        textColor = colors.danger;
        break;
      case "neutral":
        textColor = colors.textSecondary;
        break;
    }

    return {
      color: textColor,
      fontFamily: fontFamilies.bold,
      fontSize: size === "sm" ? 11 : 12,
      fontWeight: "700",
    };
  };

  return (
    <View style={[getContainerStyle(), style]}>
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
};
