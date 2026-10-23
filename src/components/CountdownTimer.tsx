import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";
import { colors } from "../theme/colors";
import { radii, spacing } from "../theme/spacing";
import { fontFamilies } from "../theme/typography";
import { toBn } from "../utils/banglaNumber";

export interface CountdownTimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  isUrgentThresholdSeconds?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onTimeUp,
  isUrgentThresholdSeconds = 120, // 2 minutes
}) => {
  // Absolute target timestamp: Date.now() + initialSeconds * 1000
  const targetTimestampRef = useRef<number>(Date.now() + initialSeconds * 1000);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diffMs = targetTimestampRef.current - now;
      const remaining = Math.max(0, Math.ceil(diffMs / 1000));
      setSecondsRemaining(remaining);

      if (remaining <= 0 && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        if (onTimeUp) {
          onTimeUp();
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [onTimeUp]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const isUrgent = secondsRemaining <= isUrgentThresholdSeconds;

  const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;

  return (
    <View
      style={[
        styles.badge,
        isUrgent ? styles.urgentBadge : styles.normalBadge,
      ]}
    >
      <Clock size={16} color={isUrgent ? colors.danger : colors.primary} />
      <Text
        style={[
          styles.timerText,
          isUrgent ? styles.urgentText : styles.normalText,
        ]}
      >
        {toBn(formattedMins)}:{toBn(formattedSecs)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1.5,
  },
  normalBadge: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  urgentBadge: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  timerText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: spacing.xs,
  },
  normalText: {
    color: colors.primary,
  },
  urgentText: {
    color: colors.danger,
  },
});
