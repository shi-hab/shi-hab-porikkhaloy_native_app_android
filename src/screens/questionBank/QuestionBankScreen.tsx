import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, ChevronDown, ChevronUp, CheckCircle2, BookOpen } from "lucide-react-native";
import { questionBankService } from "../../services/questionBankService";
import { Question } from "../../types/exam";
import { ExamTypeItem } from "../../types/questionBank";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";
import { EmptyState } from "../../components/EmptyState";
import { toBn } from "../../utils/banglaNumber";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const QuestionBankScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [examTypes, setExamTypes] = useState<ExamTypeItem[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Load Exam Types for top filter chips
  useEffect(() => {
    questionBankService
      .getExamTypes()
      .then((types) => setExamTypes(types))
      .catch(() => {});
  }, []);

  // Fetch Questions
  const fetchQuestions = useCallback(
    async (targetPage = 1, append = false) => {
      try {
        if (targetPage === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await questionBankService.getQuestions({
          page: targetPage,
          exam_type_id: selectedTypeId || undefined,
          search: search.trim() || undefined,
        });

        const newItems = res.data || [];
        if (append) {
          setQuestions((prev) => [...prev, ...newItems]);
        } else {
          setQuestions(newItems);
        }

        setHasMore(Boolean(res.next_page_url));
        setPage(targetPage);
      } catch {
        // ignore
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedTypeId, search]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions(1, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchQuestions]);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchQuestions(page + 1, true);
    }
  };

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderQuestionItem = ({ item, index }: { item: Question; index: number }) => {
    const isExpanded = expandedId === item.id;

    return (
      <View style={styles.questionCard}>
        {/* Header tags */}
        <View style={styles.cardHeader}>
          <View style={styles.serialBadge}>
            <Text style={styles.serialText}>{toBn(index + 1)}</Text>
          </View>
          <View style={styles.tagGroup}>
            {item.subject_name ? (
              <View style={styles.subjectTag}>
                <Text style={styles.subjectTagText}>{item.subject_name}</Text>
              </View>
            ) : null}
            {item.chapter_name ? (
              <View style={styles.chapterTag}>
                <Text style={styles.chapterTagText}>{item.chapter_name}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Question Text */}
        <Text style={styles.questionText}>{item.question_text}</Text>

        {/* Options */}
        <View style={styles.optionsList}>
          {(item.options || []).map((opt, optIdx) => {
            const isCorrect = Boolean(opt.is_correct);
            const serialLabel = ["ক", "খ", "গ", "ঘ"][optIdx] || String(optIdx + 1);

            return (
              <View
                key={opt.id || optIdx}
                style={[
                  styles.optionRow,
                  isExpanded && isCorrect && styles.correctOptionRow,
                ]}
              >
                <View
                  style={[
                    styles.optionSerialBubble,
                    isExpanded && isCorrect && styles.correctBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionSerialText,
                      isExpanded && isCorrect && styles.correctBubbleText,
                    ]}
                  >
                    {serialLabel}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isExpanded && isCorrect && styles.correctOptionText,
                  ]}
                >
                  {opt.option_text}
                </Text>
                {isExpanded && isCorrect && (
                  <CheckCircle2 size={16} color={colors.success} style={{ marginLeft: "auto" }} />
                )}
              </View>
            );
          })}
        </View>

        {/* Explanation toggle */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleExpand(item.id)}
          style={styles.expandToggle}
        >
          <Text style={styles.expandToggleText}>
            {isExpanded ? "ব্যাখ্যা লুকান" : "সঠিক উত্তর ও ব্যাখ্যা দেখুন"}
          </Text>
          {isExpanded ? (
            <ChevronUp size={16} color={colors.primary} />
          ) : (
            <ChevronDown size={16} color={colors.primary} />
          )}
        </TouchableOpacity>

        {isExpanded && item.explanation ? (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationLabel}>ব্যাখ্যা:</Text>
            <Text style={styles.explanationText}>{item.explanation}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Header */}
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>প্রশ্ন ব্যাংক</Text>
        <Text style={styles.headerSubtitle}>
          লক্ষাধিক বিগত বছরের ও অধ্যায়ভিত্তিক প্রশ্ন অনুশীলন করো
        </Text>

        <View style={styles.searchBar}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="প্রশ্ন বা বিষয় লিখে খুঁজুন..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Filter Chips */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
          data={[{ id: null, name: "সকল প্রশ্ন" } as any, ...examTypes]}
          keyExtractor={(item) => String(item.id ?? "all")}
          renderItem={({ item }) => {
            const isSelected = selectedTypeId === item.id;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedTypeId(item.id)}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Virtualized Question Feed */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : questions.length === 0 ? (
        <EmptyState
          title="কোনো প্রশ্ন পাওয়া যায়নি"
          description="অন্য কোনো কী-ওয়ার্ড বা ক্যাটাগরি বেছে চেষ্টা করুন।"
        />
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderQuestionItem}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerArea: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  chipsContainer: {
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    fontFamily: fontFamilies.bold,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  filterChipTextSelected: {
    color: colors.textInverted,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.huge,
  },
  questionCard: {
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
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  serialBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  serialText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: colors.primary,
    fontWeight: "700",
  },
  tagGroup: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  subjectTag: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  subjectTagText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: colors.secondary,
  },
  chapterTag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  chapterTagText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: colors.textSecondary,
  },
  questionText: {
    ...typography.body,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  correctOptionRow: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  optionSerialBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  correctBubble: {
    backgroundColor: colors.success,
  },
  optionSerialText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  correctBubbleText: {
    color: colors.textInverted,
  },
  optionText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    flex: 1,
  },
  correctOptionText: {
    fontFamily: fontFamilies.bold,
    color: colors.success,
    fontWeight: "700",
  },
  expandToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
  expandToggleText: {
    ...typography.caption,
    fontFamily: fontFamilies.bold,
    color: colors.primary,
    fontWeight: "700",
    marginRight: 4,
  },
  explanationBox: {
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radii.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  explanationLabel: {
    ...typography.caption,
    fontFamily: fontFamilies.bold,
    color: colors.primary,
    fontWeight: "700",
    marginBottom: 2,
  },
  explanationText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLoader: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
});
