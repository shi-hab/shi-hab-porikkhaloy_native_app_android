import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Award, Crown, Flame, Medal } from "lucide-react-native";
import { leaderboardService } from "../../services/leaderboardService";
import { LeaderboardUser, MyLeaderboardStatus } from "../../types/leaderboard";
import { Header } from "../../components/Header";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";
import { toBn } from "../../utils/banglaNumber";
import { useNavigation } from "@react-navigation/native";

export const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation();

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [myStatus, setMyStatus] = useState<MyLeaderboardStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      leaderboardService.getLeaderboard(),
      leaderboardService.getMyStatus(),
    ])
      .then(([lbRes, myRes]) => {
        if (lbRes.status === "fulfilled") {
          setLeaderboard(lbRes.value?.data || []);
        }
        if (myRes.status === "fulfilled") {
          setMyStatus(myRes.value);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <View style={styles.container}>
      <Header title="লিডারবোর্ড" onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          data={rest}
          keyExtractor={(item) => String(item.student_id || item.rank)}
          ListHeaderComponent={
            <View>
              {/* Podium for top 3 */}
              <View style={styles.podiumContainer}>
                {topThree[1] && (
                  <View style={[styles.podiumCol, styles.podiumSecond]}>
                    <View style={styles.podiumAvatar}>
                      <Text style={styles.podiumRankText}>২</Text>
                    </View>
                    <Text style={styles.podiumName} numberOfLines={1}>
                      {topThree[1].name}
                    </Text>
                    <Text style={styles.podiumScore}>{toBn(topThree[1].score)} পয়েন্ট</Text>
                  </View>
                )}

                {topThree[0] && (
                  <View style={[styles.podiumCol, styles.podiumFirst]}>
                    <Crown size={24} color="#EAB308" style={{ marginBottom: 4 }} />
                    <View style={[styles.podiumAvatar, styles.avatarFirst]}>
                      <Text style={[styles.podiumRankText, { color: "#FFFFFF" }]}>১</Text>
                    </View>
                    <Text style={[styles.podiumName, { fontWeight: "700" }]} numberOfLines={1}>
                      {topThree[0].name}
                    </Text>
                    <Text style={styles.podiumScore}>{toBn(topThree[0].score)} পয়েন্ট</Text>
                  </View>
                )}

                {topThree[2] && (
                  <View style={[styles.podiumCol, styles.podiumThird]}>
                    <View style={styles.podiumAvatar}>
                      <Text style={styles.podiumRankText}>৩</Text>
                    </View>
                    <Text style={styles.podiumName} numberOfLines={1}>
                      {topThree[2].name}
                    </Text>
                    <Text style={styles.podiumScore}>{toBn(topThree[2].score)} পয়েন্ট</Text>
                  </View>
                )}
              </View>

              {/* My Status Sticky Strip */}
              {myStatus && (
                <View style={styles.myRankCard}>
                  <View style={styles.myRankLeft}>
                    <Text style={styles.myRankNumber}>#{toBn(myStatus.rank)}</Text>
                    <View style={{ marginLeft: spacing.md }}>
                      <Text style={styles.myRankTitle}>তোমার বর্তমান অবস্থান</Text>
                      <Text style={styles.myRankTier}>টিয়ার: {myStatus.tier || "ডায়মন্ড"}</Text>
                    </View>
                  </View>
                  <Text style={styles.myRankScore}>{toBn(myStatus.score)} পয়েন্ট</Text>
                </View>
              )}

              <Text style={styles.listHeading}>সার্বিক র‍্যাঙ্কিং</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.rankRow}>
              <Text style={styles.rankNumber}>{toBn(item.rank)}</Text>
              <View style={styles.rankInfo}>
                <Text style={styles.rankName}>{item.name}</Text>
                {item.institution ? (
                  <Text style={styles.rankInstitution}>{item.institution}</Text>
                ) : null}
              </View>
              <Text style={styles.rankScore}>{toBn(item.score)} পয়েন্ট</Text>
            </View>
          )}
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.huge,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  podiumContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  podiumCol: {
    alignItems: "center",
    flex: 1,
  },
  podiumFirst: {
    marginBottom: spacing.md,
  },
  podiumSecond: {
    marginBottom: 0,
  },
  podiumThird: {
    marginBottom: 0,
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  avatarFirst: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    borderColor: colors.accent,
  },
  podiumRankText: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  podiumName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 90,
  },
  podiumScore: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "700",
    fontSize: 11,
  },
  myRankCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  myRankLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  myRankNumber: {
    ...typography.h2,
    color: colors.primary,
  },
  myRankTitle: {
    ...typography.subtitle,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  myRankTier: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  myRankScore: {
    ...typography.h3,
    color: colors.primary,
  },
  listHeading: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  rankNumber: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.textSecondary,
    width: 32,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    ...typography.body,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  rankInstitution: {
    ...typography.caption,
    color: colors.textMuted,
  },
  rankScore: {
    ...typography.bodySmall,
    fontFamily: fontFamilies.bold,
    color: colors.primary,
  },
});
