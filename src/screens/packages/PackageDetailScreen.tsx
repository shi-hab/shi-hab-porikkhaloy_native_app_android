import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Clock,
  Users,
  Check,
  FileText,
  Lock,
  PlayCircle,
  MessageCircle,
  ShieldCheck,
} from "lucide-react-native";
import { RootStackParamList } from "../../navigation/types";
import { packageService } from "../../services/packageService";
import { examService } from "../../services/examService";
import { ModelTest } from "../../types/package";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";
import { toBn, formatTaka } from "../../utils/banglaNumber";

type PackageDetailRouteProp = RouteProp<RootStackParamList, "PackageDetail">;

export const PackageDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<PackageDetailRouteProp>();
  const { pkg } = route.params;

  const [modelTests, setModelTests] = useState<ModelTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    packageService
      .getModelTestsByPackageId(pkg.id)
      .then((tests) => setModelTests(tests || []))
      .catch(() => setModelTests([]))
      .finally(() => setLoading(false));
  }, [pkg.id]);

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const res = await packageService.subscribe(pkg.id);
      if (res.payment_url) {
        Linking.openURL(res.payment_url);
      } else {
        Alert.alert("সফল", "প্যাকেজ সাবস্ক্রিপশন সম্পন্ন হয়েছে!");
      }
    } catch (err: any) {
      Alert.alert("পেমেন্ট ব্যর্থ হয়েছে", err.message || "অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setSubscribing(false);
    }
  };

  const handleStartModelTest = async (test: ModelTest) => {
    try {
      const exams = await packageService.getExamsUnderModelTest(test.id);
      if (exams && exams.length > 0) {
        const firstExam = exams[0];
        const res = await examService.startExam({ exam_id: firstExam.id });
        if (res.exam && res.questions_list) {
          navigation.navigate("ExamLive", {
            exam: res.exam,
            questions: res.questions_list,
            resumedAnswers: res.mcqAnswers,
          });
          return;
        }
      }
      Alert.alert("তথ্য", "এই মডেল টেস্টের প্রশ্ন এখনও উন্মুক্ত হয়নি।");
    } catch (err: any) {
      Alert.alert("ত্রুটি", err.message || "পরীক্ষা শুরু করা যায়নি।");
    }
  };

  const handleOpenWhatsApp = () => {
    Linking.openURL("https://wa.me/8801706429945?text=Hello%20Porikkhaloy%20Support");
  };

  return (
    <View style={styles.container}>
      <Header title={pkg.title || pkg.name} onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{pkg.title || pkg.name}</Text>
          {pkg.description ? (
            <Text style={styles.heroDesc}>{pkg.description}</Text>
          ) : null}

          <View style={styles.badgeRow}>
            {pkg.duration_days ? (
              <View style={styles.infoBadge}>
                <Clock size={14} color={colors.primary} />
                <Text style={styles.infoBadgeText}>{toBn(pkg.duration_days)} দিন মেয়াদ</Text>
              </View>
            ) : null}

            {pkg.display_student_count ? (
              <View style={styles.infoBadge}>
                <Users size={14} color={colors.secondary} />
                <Text style={styles.infoBadgeText}>{toBn(pkg.display_student_count)}+ শিক্ষার্থী</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View>
            <Text style={styles.pricingLabel}>ফি / মূল্য</Text>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>{formatTaka(pkg.price)}</Text>
              {pkg.discount ? (
                <View style={styles.discountTag}>
                  <Text style={styles.discountTagText}>{toBn(pkg.discount)}% ডিসকাউন্ট</Text>
                </View>
              ) : null}
            </View>
          </View>

          <Button
            title={pkg.is_subscribed ? "ইতিমধ্যে এনরোল্ড" : "ভর্তি হও (bKash)"}
            onPress={handleSubscribe}
            disabled={Boolean(pkg.is_subscribed)}
            loading={subscribing}
            variant="primary"
            size="md"
          />
        </View>

        {/* Model Test Routine / Exams list */}
        <Text style={styles.sectionTitle}>মডেল টেস্ট ও পরীক্ষার তালিকা</Text>

        {loading ? (
          <View style={styles.loaderArea}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : modelTests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>এই ব্যাচে শীঘ্রই নতুন মডেল টেস্ট যোগ করা হবে।</Text>
          </View>
        ) : (
          <View style={styles.testsList}>
            {modelTests.map((test, idx) => {
              const isFree = Boolean(test.is_free);
              const canAccess = pkg.is_subscribed || isFree;

              return (
                <TouchableOpacity
                  key={test.id || idx}
                  activeOpacity={0.8}
                  disabled={!canAccess}
                  onPress={() => handleStartModelTest(test)}
                  style={[
                    styles.testCard,
                    !canAccess && styles.testCardLocked,
                  ]}
                >
                  <View style={styles.testLeft}>
                    <View
                      style={[
                        styles.testIndexCircle,
                        isFree && { backgroundColor: colors.successLight },
                      ]}
                    >
                      <Text
                        style={[
                          styles.testIndexText,
                          isFree && { color: colors.success },
                        ]}
                      >
                        {toBn(idx + 1)}
                      </Text>
                    </View>
                    <View style={styles.testInfo}>
                      <Text style={styles.testTitle}>{test.title}</Text>
                      <Text style={styles.testSub}>
                        {test.total_exams ? `${toBn(test.total_exams)}টি পরীক্ষা` : "পূর্ণাঙ্গ পরীক্ষা"}
                      </Text>
                    </View>
                  </View>

                  {canAccess ? (
                    <View style={styles.startBadge}>
                      <PlayCircle size={14} color={colors.primary} />
                      <Text style={styles.startBadgeText}>পরীক্ষা দাও</Text>
                    </View>
                  ) : (
                    <View style={styles.lockBadge}>
                      <Lock size={14} color={colors.textMuted} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* WhatsApp Mentor Help Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOpenWhatsApp}
          style={styles.whatsAppCard}
        >
          <View style={styles.waIconCircle}>
            <MessageCircle size={22} color="#16A34A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.waTitle}>মেন্টর সহায়তা চাও?</Text>
            <Text style={styles.waSubtitle}>সরাসরি হোয়াটসঅ্যাপে আমাদের সাথে কথা বলো</Text>
          </View>
        </TouchableOpacity>
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
    gap: spacing.lg,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.subtle,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  heroDesc: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    gap: spacing.xs,
  },
  infoBadgeText: {
    ...typography.caption,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  pricingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadows.card,
  },
  pricingLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  currentPrice: {
    ...typography.h2,
    color: colors.primary,
  },
  discountTag: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  discountTagText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: colors.danger,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  loaderArea: {
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  testsList: {
    gap: spacing.sm,
  },
  testCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  testCardLocked: {
    opacity: 0.7,
  },
  testLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  testIndexCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  testIndexText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: colors.primary,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    ...typography.subtitle,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  testSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  startBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    gap: 4,
  },
  startBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: colors.primary,
  },
  lockBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  whatsAppCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  waIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  waTitle: {
    ...typography.subtitle,
    fontFamily: fontFamilies.bold,
    color: "#166534",
  },
  waSubtitle: {
    ...typography.caption,
    color: "#15803D",
  },
});
