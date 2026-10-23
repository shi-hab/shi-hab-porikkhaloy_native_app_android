import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Check, Clock, Layers, Sparkles, BookOpen } from "lucide-react-native";
import { RootStackParamList } from "../../navigation/types";
import { examService } from "../../services/examService";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";
import { toBn } from "../../utils/banglaNumber";

const QUESTION_COUNTS = [10, 20, 30, 50];
const DURATIONS = [10, 15, 20, 30, 45]; // in minutes

export const MockTestWizardScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [duration, setDuration] = useState<number>(20);

  useEffect(() => {
    examService
      .getMockBootstrap()
      .then((data) => {
        const subjs = data?.subjects || data?.data?.subjects || [
          { id: 1, name: "পদার্থবিজ্ঞান" },
          { id: 2, name: "রসায়ন" },
          { id: 3, name: "উচ্চতর গণিত" },
          { id: 4, name: "জীববিজ্ঞান" },
          { id: 5, name: "বাংলা" },
          { id: 6, name: "ইংরেজি" },
          { id: 7, name: "সাধারণ জ্ঞান" },
        ];
        setSubjects(subjs);
        if (subjs.length > 0) {
          setSelectedSubjectIds([subjs[0].id]);
        }
      })
      .catch(() => {
        // Fallback default subjects if offline/unreachable
        setSubjects([
          { id: 1, name: "পদার্থবিজ্ঞান" },
          { id: 2, name: "রসায়ন" },
          { id: 3, name: "উচ্চতর গণিত" },
          { id: 4, name: "জীববিজ্ঞান" },
          { id: 5, name: "বাংলা" },
          { id: 6, name: "ইংরেজি" },
        ]);
        setSelectedSubjectIds([1]);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSubject = (id: number) => {
    if (selectedSubjectIds.includes(id)) {
      if (selectedSubjectIds.length > 1) {
        setSelectedSubjectIds(selectedSubjectIds.filter((x) => x !== id));
      } else {
        Alert.alert("সতর্কতা", "কমপক্ষে একটি বিষয় নির্বাচন করতে হবে।");
      }
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, id]);
    }
  };

  const handleStartExam = async () => {
    if (selectedSubjectIds.length === 0) {
      Alert.alert("সতর্কতা", "অনুগ্রহ করে কমপক্ষে একটি বিষয় নির্বাচন করুন।");
      return;
    }

    setStarting(true);
    try {
      const res = await examService.startExam({
        type: "mcq",
        question_count: questionCount,
        duration: duration,
      });

      if (res.exam && res.questions_list?.length > 0) {
        navigation.replace("ExamLive", {
          exam: res.exam,
          questions: res.questions_list,
          resumedAnswers: res.mcqAnswers,
        });
      } else {
        Alert.alert("ত্রুটি", "পরীক্ষার প্রশ্ন লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch (err: any) {
      Alert.alert("পরীক্ষা শুরু করা যায়নি", err.message || "অনুগ্রহ করে সংযোগ পরীক্ষা করুন।");
    } finally {
      setStarting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="কাস্টম মডেল টেস্ট" onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Step 1: Subjects */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>১</Text>
              </View>
              <Text style={styles.cardTitle}>বিষয় নির্বাচন করো</Text>
            </View>
            <Text style={styles.cardSubtitle}>
              যেসব বিষয়ের ওপর পরীক্ষা দিতে চাও সেগুলো সিলেক্ট করো
            </Text>

            <View style={styles.subjectsGrid}>
              {subjects.map((sub) => {
                const isSelected = selectedSubjectIds.includes(sub.id);
                return (
                  <TouchableOpacity
                    key={sub.id}
                    activeOpacity={0.8}
                    onPress={() => toggleSubject(sub.id)}
                    style={[
                      styles.subjectChip,
                      isSelected && styles.subjectChipSelected,
                    ]}
                  >
                    <BookOpen
                      size={16}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.subjectChipText,
                        isSelected && styles.subjectChipTextSelected,
                      ]}
                    >
                      {sub.name}
                    </Text>
                    {isSelected ? (
                      <View style={styles.checkBubble}>
                        <Check size={12} color="#FFFFFF" />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Step 2: Question Count */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>২</Text>
              </View>
              <Text style={styles.cardTitle}>প্রশ্নের সংখ্যা</Text>
            </View>

            <View style={styles.presetsRow}>
              {QUESTION_COUNTS.map((cnt) => {
                const isSelected = questionCount === cnt;
                return (
                  <TouchableOpacity
                    key={cnt}
                    activeOpacity={0.8}
                    onPress={() => setQuestionCount(cnt)}
                    style={[
                      styles.presetButton,
                      isSelected && styles.presetButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetButtonText,
                        isSelected && styles.presetButtonTextSelected,
                      ]}
                    >
                      {toBn(cnt)}টি
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Step 3: Duration */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>৩</Text>
              </View>
              <Text style={styles.cardTitle}>পরীক্ষার সময়সীমা (মিনিট)</Text>
            </View>

            <View style={styles.presetsRow}>
              {DURATIONS.map((dur) => {
                const isSelected = duration === dur;
                return (
                  <TouchableOpacity
                    key={dur}
                    activeOpacity={0.8}
                    onPress={() => setDuration(dur)}
                    style={[
                      styles.presetButton,
                      isSelected && styles.presetButtonSelected,
                    ]}
                  >
                    <Clock
                      size={14}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.presetButtonText,
                        isSelected && styles.presetButtonTextSelected,
                      ]}
                    >
                      {toBn(dur)} মি.
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Action Button */}
          <Button
            title="পরীক্ষা শুরু করো"
            onPress={handleStartExam}
            loading={starting}
            size="lg"
            variant="primary"
            style={styles.startBtn}
          />
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.subtle,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  stepBadgeText: {
    color: colors.textInverted,
    fontFamily: fontFamilies.bold,
    fontSize: 12,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  subjectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  subjectChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  subjectChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  subjectChipText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  subjectChipTextSelected: {
    color: colors.primary,
    fontFamily: fontFamilies.bold,
    fontWeight: "700",
  },
  checkBubble: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  presetsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  presetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 4,
  },
  presetButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  presetButtonText: {
    ...typography.button,
    color: colors.textSecondary,
    fontSize: 13,
  },
  presetButtonTextSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
  startBtn: {
    marginTop: spacing.sm,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
