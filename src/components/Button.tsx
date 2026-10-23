import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import { colors } from "../theme/colors";
import { radii, spacing } from "../theme/spacing";
import { fontFamilies } from "../theme/typography";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    onPress();
  };

  const getContainerStyle = () => {
    const base: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radii.xl,
    };

    // Size
    if (size === "sm") {
      base.paddingVertical = spacing.sm;
      base.paddingHorizontal = spacing.md;
    } else if (size === "lg") {
      base.paddingVertical = spacing.lg;
      base.paddingHorizontal = spacing.xxl;
    } else {
      base.paddingVertical = spacing.md;
      base.paddingHorizontal = spacing.xl;
    }

    // Variant
    switch (variant) {
      case "primary":
        base.backgroundColor = colors.primary;
        break;
      case "secondary":
        base.backgroundColor = colors.secondary;
        break;
      case "accent":
        base.backgroundColor = colors.accent;
        break;
      case "outline":
        base.backgroundColor = "transparent";
        base.borderWidth = 1.5;
        base.borderColor = colors.primary;
        break;
      case "ghost":
        base.backgroundColor = "transparent";
        break;
      case "danger":
        base.backgroundColor = colors.danger;
        break;
    }

    if (disabled) {
      base.opacity = 0.5;
    }

    return base;
  };

  const getTextStyle = () => {
    const base: TextStyle = {
      fontFamily: fontFamilies.bold,
      fontSize: size === "sm" ? 13 : size === "lg" ? 17 : 15,
      fontWeight: "700",
      textAlign: "center",
    };

    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
        base.color = colors.textInverted;
        break;
      case "accent":
        base.color = colors.textPrimary;
        break;
      case "outline":
      case "ghost":
        base.color = colors.primary;
        break;
    }

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "accent" || variant === "outline" || variant === "ghost" ? colors.primary : "#FFFFFF"}
        />
      ) : (
        <>
          {leftIcon ? <>{leftIcon}</> : null}
          <Text style={[getTextStyle(), leftIcon ? { marginLeft: spacing.sm } : undefined, rightIcon ? { marginRight: spacing.sm } : undefined, textStyle]}>
            {title}
          </Text>
          {rightIcon ? <>{rightIcon}</> : null}
        </>
      )}
    </TouchableOpacity>
  );
};
