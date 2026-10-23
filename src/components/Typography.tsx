import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export interface TypographyProps extends TextProps {
  variant?: keyof typeof typography;
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  color = colors.textPrimary,
  align = "left",
  style,
  children,
  ...rest
}) => {
  return (
    <Text
      style={[
        typography[variant],
        { color, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};
