import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  User,
  Phone,
  GraduationCap,
  Award,
  Flame,
  LogOut,
  Trash2,
  ChevronRight,
  Shield,
  FileQuestion,
  HelpCircle,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { RootStackParamList } from "../../navigation/types";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";
import { toBn } from "../../utils/banglaNumber";

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { student, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("লগআউট", "তুমি কি নিশ্চিত লগআউট করতে চাও?", [
      { text: "না", style: "cancel" },
      {
        text: "হ্যাঁ, লগআউট",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <User size={36} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{student?.name || "শিক্ষার্থী"}</Text>
          <Text style={styles.userPhone}>{student?.phone || "01XXXXXXXXX"}</Text>

          {student?.target ? (
            <View style={styles.targetBadge}>
              <GraduationCap size={14} color={colors.secondary} />
              <Text style={styles.targetBadgeText}>{student.target}</Text>
            </View>
          ) : null}
        </View>

        {/* Quick Menu */}
        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Streak")}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: "#FFF7ED" }]}>
              <Flame size={20} color="#EA580C" />
            </View>
            <View style={styles.menuItemTextContainer}>
              <Text style={styles.menuItemTitle}>প্র্যাকটিস স্ট্রিক</Text>
              <Text style={styles.menuItemSubtitle}>তোমার দৈনন্দিন পড়াশোনার রেকর্ড</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Leaderboard")}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Award size={20} color={colors.primary} />
            </View>
            <View style={styles.menuItemTextContainer}>
              <Text style={styles.menuItemTitle}>লিডারবোর্ড ও র‍্যাঙ্কিং</Text>
              <Text style={styles.menuItemSubtitle}>অন্যান্য সহপাঠীদের সাথে তোমার অবস্থান</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Support & Logout */}
        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: colors.dangerLight }]}>
              <LogOut size={20} color={colors.danger} />
            </View>
            <View style={styles.menuItemTextContainer}>
              <Text style={[styles.menuItemTitle, { color: colors.danger }]}>
                লগআউট করুন
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.appVersion}>Porikkhaloy App v1.0.0 • Mobile Production</Text>
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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  userPhone: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  targetBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    marginTop: spacing.md,
    gap: 4,
  },
  targetBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: colors.secondary,
  },
  menuGroup: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.subtle,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    ...typography.subtitle,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  menuItemSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  appVersion: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});
