import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Flame,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  PlayCircle,
  HelpCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { RootStackParamList } from "../../navigation/types";
import { dashboardService, DashboardData } from "../../services/dashboardService";
import { packageService } from "../../services/packageService";
import { Package } from "../../types/package";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";
import { toBn, formatTaka } from "../../utils/banglaNumber";

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { student } = useAuth();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [dashData, pkgs] = await Promise.allSettled([
        dashboardService.getDashboardData(),
        packageService.getAllPackages(),
      ]);

      if (dashData.status === "fulfilled") {
        setDashboard(dashData.value);
      }
      if (pkgs.status === "fulfilled") {
        setPackages(pkgs.value.slice(0, 4));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const streakDays = dashboard?.studentStreakDay?.filter((d) => d.active).length || 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.md },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Top Header & Greeting */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetingText}>শুভকামনা,</Text>
            <Text style={styles.studentName}>
              {student?.name || dashboard?.self?.name || "শিক্ষার্থী"}
            </Text>
          </View>

          {/* Streak Indicator */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Streak")}
            style={styles.streakBadge}
          >
            <Flame size={20} color="#F97316" fill="#F97316" />
            <Text style={styles.streakText}>{toBn(streakDays)} দিন</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Award size={18} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>
              {toBn(dashboard?.self?.total_exams || 0)}
            </Text>
            <Text style={styles.statLabel}>পরীক্ষা সম্পন্ন</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: colors.successLight }]}>
              <CheckCircle2 size={18} color={colors.success} />
            </View>
            <Text style={styles.statValue}>
              {toBn(dashboard?.self?.accuracy || 0)}%
            </Text>
            <Text style={styles.statLabel}>সঠিক উত্তর</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: colors.secondaryLight }]}>
              <Sparkles size={18} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>
              {toBn(dashboard?.self?.points || 0)}
            </Text>
            <Text style={styles.statLabel}>পয়েন্টস</Text>
          </View>
        </View>

        {/* Hero Banner: Custom Mock Test */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("MockTestWizard")}
          style={styles.heroBanner}
        >
          <View style={styles.heroBadge}>
            <Sparkles size={14} color="#0F172A" />
            <Text style={styles.heroBadgeText}>নিজস্ব পরীক্ষা তৈরি করো</Text>
          </View>
          <Text style={styles.heroTitle}>নিজের মতো করে মডেল টেস্ট বানাও</Text>
          <Text style={styles.heroSubtitle}>
            বিষয়, অধ্যায় ও প্রশ্নের ধরন বেছে নিয়ে ইনস্ট্যান্ট পরীক্ষা শুরু করো
          </Text>
          <View style={styles.heroActionRow}>
            <View style={styles.heroButton}>
              <PlayCircle size={18} color={colors.primary} />
              <Text style={styles.heroButtonText}>মডেল টেস্ট শুরু করো</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Pori AI Quick Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => (navigation as any).navigate("MainTabs", { screen: "PoriAITab" })}
          style={styles.aiBanner}
        >
          <View style={styles.aiBannerLeft}>
            <View style={styles.aiIconBubble}>
              <Sparkles size={20} color="#0F172A" />
            </View>
            <View style={styles.aiTextContainer}>
              <View style={styles.aiTag}>
                <Text style={styles.aiTagText}>পরী এআই</Text>
              </View>
              <Text style={styles.aiTitle}>যেকোনো পড়ার সন্দেহ সমাধান করো</Text>
              <Text style={styles.aiDesc}>প্রশ্নের ছবি তুলে সমাধান নাও মুহূর্তে</Text>
            </View>
          </View>
          <ChevronRight size={22} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Live Exam Batches & Packages */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>জনপ্রিয় এক্সাম ব্যাচসমূহ</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate("MainTabs", { screen: "MockTestTab" })}>
            <Text style={styles.seeAllText}>সবগুলো দেখো</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.packagesGrid}>
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate("PackageDetail", { pkg })}
                style={styles.packageCard}
              >
                <View style={styles.packageBadgeRow}>
                  <Text style={styles.packageBadgeText}>
                    {pkg.model_tests_count ? `${toBn(pkg.model_tests_count)}টি মডেল টেস্ট` : "অনলাইন ব্যাচ"}
                  </Text>
                  {pkg.discount ? (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountBadgeText}>{toBn(pkg.discount)}% ছাড়</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.packageTitle} numberOfLines={2}>
                  {pkg.title || pkg.name}
                </Text>

                <View style={styles.packageFooter}>
                  <Text style={styles.packagePrice}>{formatTaka(pkg.price)}</Text>
                  <View style={styles.packageBtn}>
                    <Text style={styles.packageBtnText}>বিস্তারিত</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  greetingText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 13,
  },
  studentName: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    borderWidth: 1.5,
    borderColor: "#FFEDD5",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  streakText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: "700",
    color: "#C2410C",
    marginLeft: spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.subtle,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  heroBanner: {
    backgroundColor: colors.primary,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.floating,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
    alignSelf: "flex-start",
    marginBottom: spacing.md,
  },
  heroBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: "700",
    color: "#0F172A",
    marginLeft: 4,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textInverted,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...typography.bodySmall,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: spacing.lg,
  },
  heroActionRow: {
    flexDirection: "row",
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
  },
  heroButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.accentDark,
    ...shadows.subtle,
  },
  aiBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  aiIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTag: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: radii.xs,
    alignSelf: "flex-start",
    marginBottom: 2,
  },
  aiTagText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: "#3F5605",
  },
  aiTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  aiDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  seeAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontFamily: fontFamilies.bold,
    fontWeight: "600",
  },
  packagesGrid: {
    gap: spacing.md,
  },
  packageCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.subtle,
  },
  packageBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  packageBadgeText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "600",
  },
  discountBadge: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  discountBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: colors.danger,
  },
  packageTitle: {
    ...typography.subtitle,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  packageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  packagePrice: {
    ...typography.h3,
    color: colors.primary,
  },
  packageBtn: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  packageBtnText: {
    ...typography.caption,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: "center",
  },
});
