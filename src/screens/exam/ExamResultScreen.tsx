import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Award,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  Home,
  Share2,
} from "lucide-react-native";
import { RootStackParamList } from "../../navigation/types";
import { Button } from "../../components/Button";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";
import { toBn } from "../../utils/banglaNumber";

type ResultRouteProp = RouteProp<RootStackParamList, "ExamResult">;

export const ExamResultScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ResultRouteProp>();

  const { result } = route.params;

  const totalMarks = result.total_marks || 100;
  const obtainedMarks = result.obtained_marks ?? 0;
  const correct = result.correct_count ?? 0;
  const wrong = result.wrong_count ?? 0;
  const unanswered = result.unanswered_count ?? 0;
  const accuracy = Math.round(result.accuracy_percentage || (correct / Math.max(1, correct + wrong)) * 100);

  const isPassed = obtainedMarks >= (result.examination?.pass_marks || totalMarks * 0.4);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Result Header Badge */}
        <View style={styles.headerBadge}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isPassed ? colors.successLight : colors.warningLight },
            ]}
          >
            <Award
              size={44}
              color={isPassed ? colors.success : colors.warning}
            />
          </View>

          <Text style={styles.statusTitle}>
            {isPassed ? "অভিনন্দন! তুমি উত্তীর্ণ হয়েছো" : "পরীক্ষা সম্পন্ন হয়েছে"}
          </Text>
          <Text style={styles.examName} numberOfLines={2}>
            {result.examination?.title || "মডেল টেস্ট"}
          </Text>
        </View>

        {/* Big Scorecard */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreCardLabel}>প্রাপ্ত নম্বর</Text>
          <View style={styles.scoreValueRow}>
            <Text style={styles.obtainedScore}>{toBn(obtainedMarks)}</Text>
            <Text style={styles.totalScore}> / {toBn(totalMarks)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>
                {result.rank ? `#${toBn(result.rank)}` : "শীঘ্রই"}
              </Text>
              <Text style={styles.metricLabel}>মেরিট পজিশন</Text>
            </View>

            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>{toBn(accuracy)}%</Text>
              <Text style={styles.metricLabel}>নির্ভুলতার হার</Text>
            </View>
          </View>
        </View>

        {/* Detailed Breakdown */}
        <Text style={styles.sectionTitle}>বিস্তারিত বিশ্লেষণ</Text>
        <View style={styles.breakdownGrid}>
          <View style={[styles.breakdownCard, { borderColor: colors.success }]}>
            <CheckCircle size={22} color={colors.success} />
            <Text style={[styles.breakdownValue, { color: colors.success }]}>
              {toBn(correct)}টি
            </Text>
            <Text style={styles.breakdownLabel}>সঠিক উত্তর</Text>
          </View>

          <View style={[styles.breakdownCard, { borderColor: colors.danger }]}>
            <XCircle size={22} color={colors.danger} />
            <Text style={[styles.breakdownValue, { color: colors.danger }]}>
              {toBn(wrong)}টি
            </Text>
            <Text style={styles.breakdownLabel}>ভুল উত্তর</Text>
          </View>

          <View style={[styles.breakdownCard, { borderColor: colors.textMuted }]}>
            <HelpCircle size={22} color={colors.textSecondary} />
            <Text style={[styles.breakdownValue, { color: colors.textSecondary }]}>
              {toBn(unanswered)}টি
            </Text>
            <Text style={styles.breakdownLabel}>উত্তর দাওনি</Text>
          </View>
        </View>

        {/* Navigation Action Buttons */}
        <View style={styles.actionColumn}>
          <Button
            title="আবার প্র্যাকটিস করো"
            onPress={() => navigation.navigate("MockTestWizard")}
            variant="primary"
            size="lg"
            leftIcon={<RotateCcw size={18} color="#FFFFFF" />}
          />

          <Button
            title="হোম স্ক্রিনে ফিরে যাও"
            onPress={() => (navigation as any).navigate("MainTabs", { screen: "HomeTab" })}
            variant="outline"
            size="lg"
            leftIcon={<Home size={18} color={colors.primary} />}
          />
        </View>
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
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  headerBadge: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  statusTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: "center",
  },
  examName: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xxs,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.xxl,
    ...shadows.card,
  },
  scoreCardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  scoreValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  obtainedScore: {
    fontFamily: fontFamilies.bold,
    fontSize: 48,
    color: colors.primary,
    fontWeight: "900",
  },
  totalScore: {
    ...typography.h2,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    width: "100%",
    marginBottom: spacing.md,
  },
  metricsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  metricCol: {
    alignItems: "center",
  },
  metricVal: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  breakdownGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  breakdownCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1.5,
    ...shadows.subtle,
  },
  breakdownValue: {
    ...typography.h3,
    marginTop: spacing.xs,
  },
  breakdownLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
  actionColumn: {
    gap: spacing.md,
  },
});
