import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Inbox, AlertCircle, RefreshCw } from "lucide-react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { Button } from "./Button";

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
}> = ({ title, description, actionTitle, onAction }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Inbox size={36} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionTitle && onAction ? (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="outline"
          size="sm"
          style={styles.actionBtn}
        />
      ) : null}
    </View>
  );
};

export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message = "কিছু একটা ভুল হয়েছে। দয়া করে আবার চেষ্টা করুন।", onRetry }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.dangerLight }]}>
        <AlertCircle size={36} color={colors.danger} />
      </View>
      <Text style={styles.title}>ত্রুটি দেখা দিয়েছে</Text>
      <Text style={styles.description}>{message}</Text>
      {onRetry ? (
        <Button
          title="আবার চেষ্টা করুন"
          onPress={onRetry}
          variant="primary"
          size="md"
          leftIcon={<RefreshCw size={16} color="#FFFFFF" />}
          style={styles.actionBtn}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 280,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 280,
  },
  actionBtn: {
    marginTop: spacing.lg,
  },
});
