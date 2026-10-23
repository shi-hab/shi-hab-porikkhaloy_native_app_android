import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Grid,
  Send,
  X,
  AlertTriangle,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { RootStackParamList } from "../../navigation/types";
import { examService } from "../../services/examService";
import { CountdownTimer } from "../../components/CountdownTimer";
import { Button } from "../../components/Button";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";
import { toBn } from "../../utils/banglaNumber";

type ExamLiveRouteProp = RouteProp<RootStackParamList, "ExamLive">;

export const ExamLiveScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ExamLiveRouteProp>();

  const { exam, questions, resumedAnswers } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>(
    (resumedAnswers as any) || {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [paletteVisible, setPaletteVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const isSubmittingRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Instant Option Selection
  const handleSelectOption = useCallback(
    (questionId: number, optionId: number | string) => {
      try {
        Haptics.selectionAsync();
      } catch {
        // ignore
      }

      setAnswers((prev) => {
        // Toggle or select
        if (prev[questionId] === optionId) {
          const next = { ...prev };
          delete next[questionId];
          return next;
        }
        return {
          ...prev,
          [questionId]: optionId,
        };
      });
    },
    []
  );

  // Safe Final Submission
  const submitExam = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmitting(true);

    try {
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      const mcqAnswersPayload = questions.map((q) => ({
        question_id: q.id,
        selected_option_id: answers[q.id] ?? null,
      }));

      const res = await examService.finishExam({
        examination_id: exam.id,
        duration_taken_seconds: durationSeconds,
        mcq_answers: mcqAnswersPayload,
      });

      setConfirmModalVisible(false);
      navigation.replace("ExamResult", { result: res });
    } catch (err: any) {
      isSubmittingRef.current = false;
      setSubmitting(false);
      Alert.alert(
        "উত্তরপত্র জমা দেওয়া যায়নি",
        err.message || "ইন্টারনেট সংযোগ যাচাই করে পুনরায় চেষ্টা করুন। তোমার দেওয়া উত্তর সংরক্ষিত রয়েছে।"
      );
    }
  };

  const handleTimeUp = () => {
    Alert.alert("সময় সমাপ্ত!", "পরীক্ষার নির্ধারিত সময় শেষ হয়েছে। উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা হচ্ছে।", [
      { text: "ঠিক আছে", onPress: submitExam },
    ]);
    submitExam();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Exam Navigation Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.examTitle} numberOfLines={1}>
            {exam.title}
          </Text>
          <Text style={styles.questionCounter}>
            প্রশ্ন {toBn(currentIndex + 1)} / {toBn(totalQuestions)}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <CountdownTimer
            initialSeconds={exam.duration_minutes ? exam.duration_minutes * 60 : 1200}
            onTimeUp={handleTimeUp}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setPaletteVisible(true)}
            style={styles.paletteToggle}
          >
            <Grid size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Strip */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            { width: `${((currentIndex + 1) / totalQuestions) * 100}%` },
          ]}
        />
      </View>

      {/* Active Question View */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentQuestion ? (
          <View style={styles.card}>
            {/* Subject/Marks header */}
            <View style={styles.cardInfoRow}>
              {currentQuestion.subject_name ? (
                <View style={styles.subjectTag}>
                  <Text style={styles.subjectTagText}>{currentQuestion.subject_name}</Text>
                </View>
              ) : null}
              <Text style={styles.markText}>
                মান: {toBn(currentQuestion.mark || 1)}
              </Text>
            </View>

            {/* Question Text */}
            <Text style={styles.questionText}>
              {currentQuestion.question_text}
            </Text>

            {/* Options List */}
            <View style={styles.optionsList}>
              {(currentQuestion.options || []).map((opt, optIndex) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                const serialLetter = ["ক", "খ", "গ", "ঘ"][optIndex] || String(optIndex + 1);

                return (
                  <TouchableOpacity
                    key={opt.id || optIndex}
                    activeOpacity={0.8}
                    onPress={() => handleSelectOption(currentQuestion.id, opt.id)}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.optionRadio,
                        isSelected && styles.optionRadioSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionRadioText,
                          isSelected && styles.optionRadioTextSelected,
                        ]}
                      >
                        {serialLetter}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {opt.option_text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
        >
          <ArrowLeft size={18} color={currentIndex === 0 ? colors.textMuted : colors.textPrimary} />
          <Text
            style={[
              styles.navButtonText,
              currentIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            আগেরটি
          </Text>
        </TouchableOpacity>

        {currentIndex === totalQuestions - 1 ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setConfirmModalVisible(true)}
            style={styles.submitButton}
          >
            <Send size={16} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>জমা দিন</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>পরেরটি</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Question Palette Modal */}
      <Modal
        visible={paletteVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaletteVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.paletteSheet}>
            <View style={styles.paletteHeader}>
              <Text style={styles.paletteTitle}>প্রশ্ন তালিকা ({toBn(answeredCount)}/{toBn(totalQuestions)})</Text>
              <TouchableOpacity onPress={() => setPaletteVisible(false)}>
                <X size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.paletteGrid}>
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;

                return (
                  <TouchableOpacity
                    key={q.id}
                    onPress={() => {
                      setCurrentIndex(idx);
                      setPaletteVisible(false);
                    }}
                    style={[
                      styles.paletteItem,
                      isAnswered && styles.paletteItemAnswered,
                      isCurrent && styles.paletteItemCurrent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.paletteItemText,
                        isAnswered && styles.paletteItemTextAnswered,
                        isCurrent && styles.paletteItemTextCurrent,
                      ]}
                    >
                      {toBn(idx + 1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Button
              title="পরীক্ষা জমা দিতে প্রস্তুত"
              onPress={() => {
                setPaletteVisible(false);
                setConfirmModalVisible(true);
              }}
              variant="primary"
              size="md"
              style={{ marginTop: spacing.md }}
            />
          </View>
        </View>
      </Modal>

      {/* Confirmation Before Final Submit */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !submitting && setConfirmModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconCircle}>
              <AlertTriangle size={32} color={colors.warning} />
            </View>
            <Text style={styles.confirmTitle}>পরীক্ষা জমা দিতে চাও?</Text>
            <Text style={styles.confirmDesc}>
              একবার জমা দেওয়ার পর উত্তর পরিবর্তন করা যাবে না।
            </Text>

            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{toBn(totalQuestions)}</Text>
                <Text style={styles.summaryLabel}>মোট প্রশ্ন</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  {toBn(answeredCount)}
                </Text>
                <Text style={styles.summaryLabel}>উত্তর দেওয়া</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.danger }]}>
                  {toBn(unansweredCount)}
                </Text>
                <Text style={styles.summaryLabel}>অনুত্তরিত</Text>
              </View>
            </View>

            <View style={styles.confirmActions}>
              <Button
                title="ফিরে যাও"
                onPress={() => setConfirmModalVisible(false)}
                variant="outline"
                disabled={submitting}
                style={{ flex: 1 }}
              />
              <Button
                title="হ্যাঁ, জমা দাও"
                onPress={submitExam}
                loading={submitting}
                variant="primary"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  examTitle: {
    ...typography.subtitle,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  questionCounter: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  paletteToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
    width: "100%",
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.huge,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  cardInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  subjectTag: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  subjectTagText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: colors.secondary,
  },
  markText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  questionText: {
    ...typography.h3,
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: spacing.xl,
  },
  optionsList: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionRadio: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  optionRadioSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionRadioText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  optionRadioTextSelected: {
    color: colors.textInverted,
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
  optionTextSelected: {
    fontFamily: fontFamilies.bold,
    color: colors.primary,
    fontWeight: "700",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceSecondary,
    gap: spacing.xs,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  navButtonTextDisabled: {
    color: colors.textMuted,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.primary,
    gap: spacing.xs,
  },
  nextButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.textInverted,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.success,
    gap: spacing.xs,
  },
  submitButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.textInverted,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  paletteSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    padding: spacing.xl,
    maxHeight: "75%",
  },
  paletteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  paletteTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  paletteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  paletteItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  paletteItemAnswered: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paletteItemCurrent: {
    borderWidth: 2.5,
    borderColor: colors.accentDark,
  },
  paletteItemText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  paletteItemTextAnswered: {
    color: colors.textInverted,
  },
  paletteItemTextCurrent: {
    fontWeight: "900",
  },
  confirmCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    margin: spacing.xl,
    padding: spacing.xl,
    alignItems: "center",
    alignSelf: "center",
    maxWidth: 340,
    width: "100%",
  },
  confirmIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.warningLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  confirmTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  confirmDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  summaryStats: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  confirmActions: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
});
