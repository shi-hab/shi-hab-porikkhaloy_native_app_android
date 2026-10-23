import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Flame, Calendar, Award, Check } from "lucide-react-native";
import { dashboardService, DashboardData } from "../../services/dashboardService";
import { Header } from "../../components/Header";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";
import { toBn } from "../../utils/banglaNumber";

export const StreakScreen: React.FC = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    dashboardService
      .getDashboardData()
      .then((d) => setDashboard(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const streakDays = dashboard?.studentStreakDay || [];
  const activeDaysCount = streakDays.filter((d) => d.active).length;

  return (
    <View style={styles.container}>
      <Header title="প্র্যাকটিস স্ট্রিক" onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Flame Card */}
          <View style={styles.flameCard}>
            <View style={styles.flameCircle}>
              <Flame size={48} color="#EA580C" fill="#EA580C" />
            </View>
            <Text style={styles.streakNumber}>{toBn(activeDaysCount)}</Text>
            <Text style={styles.streakUnit}>দিনের ধারাবাহিক স্ট্রিক</Text>
            <Text style={styles.streakMotivation}>
              প্রতিদিন অন্তত একটি মডেল টেস্ট সম্পন্ন করো এবং ধারাবাহিকতা বজায় রাখো!
            </Text>
          </View>

          {/* Practice History Calendar Grid */}
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Calendar size={18} color={colors.primary} />
              <Text style={styles.calendarTitle}>গত ৩০ দিনের প্র্যাকটিস রেকর্ড</Text>
            </View>

            <View style={styles.gridContainer}>
              {streakDays.length === 0 ? (
                <Text style={styles.emptyNote}>
                  আজ থেকেই পরীক্ষা দেওয়া শুরু করো এবং তোমার স্ট্রিক তৈরি করো!
                </Text>
              ) : (
                streakDays.map((item, idx) => (
                  <View
                    key={item.date || idx}
                    style={[
                      styles.dayBox,
                      item.active && styles.dayBoxActive,
                    ]}
                  >
                    {item.active ? (
                      <Check size={14} color="#FFFFFF" />
                    ) : (
                      <Text style={styles.dayText}>{toBn(idx + 1)}</Text>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.huge,
    gap: spacing.lg,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flameCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: radii.xxl,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFEDD5",
    ...shadows.card,
  },
  flameCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  streakNumber: {
    fontFamily: fontFamilies.bold,
    fontSize: 56,
    color: "#C2410C",
    fontWeight: "900",
  },
  streakUnit: {
    ...typography.h3,
    color: "#9A3412",
    marginBottom: spacing.xs,
  },
  streakMotivation: {
    ...typography.bodySmall,
    color: "#9A3412",
    textAlign: "center",
    maxWidth: 260,
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.subtle,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  calendarTitle: {
    ...typography.subtitle,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    justifyContent: "center",
  },
  dayBox: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBoxActive: {
    backgroundColor: "#EA580C",
  },
  dayText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: colors.textMuted,
  },
  emptyNote: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: spacing.md,
  },
});
