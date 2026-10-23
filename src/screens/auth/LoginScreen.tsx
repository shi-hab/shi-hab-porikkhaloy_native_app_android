import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Lock, Phone, Sparkles } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { RootStackParamList } from "../../navigation/types";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let isValid = true;
    setPhoneError("");
    setPasswordError("");

    const cleanPhone = phone.trim().replace(/^(\+?880)/, "0");
    if (!cleanPhone) {
      setPhoneError("ফোন নম্বর লিখুন");
      isValid = false;
    } else if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setPhoneError("সঠিক ১১ ডিজিটের ফোন নম্বর লিখুন (যেমন: 017xxxxxxxx)");
      isValid = false;
    }

    if (!password) {
      setPasswordError("পাসওয়ার্ড লিখুন");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const cleanPhone = phone.trim().replace(/^(\+?880)/, "0");
      await login(cleanPhone, password);
    } catch (err: any) {
      Alert.alert("লগইন ব্যর্থ হয়েছে", err.message || "দয়া করে তথ্য যাচাই করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <Sparkles size={18} color={colors.accent} />
            <Text style={styles.brandBadgeText}>পরীক্ষালয় • স্মার্ট প্রস্তুতি</Text>
          </View>
          <Text style={styles.title}>স্বাগতম!</Text>
          <Text style={styles.subtitle}>
            পরীক্ষালয়ে লগইন করে তোমার প্রস্তুতিকে এগিয়ে নাও
          </Text>
        </View>

        <View style={styles.formCard}>
          <Input
            label="মোবাইল নম্বর"
            placeholder="01XXXXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(txt) => {
              setPhone(txt);
              if (phoneError) setPhoneError("");
            }}
            error={phoneError}
            leftIcon={<Phone size={18} color={colors.textSecondary} />}
            autoCapitalize="none"
          />

          <Input
            label="পাসওয়ার্ড"
            placeholder="তোমার পাসওয়ার্ড"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (passwordError) setPasswordError("");
            }}
            error={passwordError}
            isPassword
            leftIcon={<Lock size={18} color={colors.textSecondary} />}
          />

          <Button
            title="লগইন করো"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            size="lg"
            style={styles.loginBtn}
          />

          <View style={styles.registerPrompt}>
            <Text style={styles.promptText}>অ্যাকাউন্ট নেই? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>নতুন অ্যাকাউন্ট তৈরি করো</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  brandBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    marginBottom: spacing.md,
  },
  brandBadgeText: {
    color: colors.textInverted,
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    marginLeft: spacing.xs,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
    maxWidth: 290,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  loginBtn: {
    marginTop: spacing.md,
  },
  registerPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  promptText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.body,
    fontFamily: fontFamilies.bold,
    color: colors.primary,
    fontWeight: "700",
  },
});
