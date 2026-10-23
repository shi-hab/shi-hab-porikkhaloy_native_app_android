import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { radii, shadows, spacing } from "../theme/spacing";

export interface CardProps extends ViewProps {
  elevated?: boolean;
  bordered?: boolean;
  padding?: keyof typeof spacing;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  elevated = true,
  bordered = true,
  padding = "lg",
  style,
  children,
  ...rest
}) => {
  return (
    <View
      style={[
        styles.card,
        bordered && styles.bordered,
        elevated && shadows.card,
        { padding: spacing[padding] },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
});
