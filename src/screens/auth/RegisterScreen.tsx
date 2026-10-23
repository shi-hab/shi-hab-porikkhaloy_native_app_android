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
import { Lock, Phone, User, GraduationCap } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { RootStackParamList } from "../../navigation/types";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Header } from "../../components/Header";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";

const ACADEMIC_TARGETS = [
  { id: "admission_medical", label: "মেডিকেল ভর্তি পরীক্ষা" },
  { id: "admission_eng", label: "ইঞ্জিনিয়ারিং ভর্তি পরীক্ষা" },
  { id: "admission_varsity", label: "ভার্সিটি ক/খ/গ ইউনিট" },
  { id: "hsc_science", label: "HSC (বিজ্ঞান)" },
  { id: "hsc_humanities", label: "HSC (মানবিক/ব্যবসায়)" },
  { id: "ssc", label: "SSC" },
];

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [target, setTarget] = useState(ACADEMIC_TARGETS[0].id);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let isValid = true;
    setNameError("");
    setPhoneError("");
    setPasswordError("");

    if (!name.trim()) {
      setNameError("তোমার নাম লিখুন");
      isValid = false;
    }

    const cleanPhone = phone.trim().replace(/^(\+?880)/, "0");
    if (!cleanPhone) {
      setPhoneError("ফোন নম্বর লিখুন");
      isValid = false;
    } else if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setPhoneError("সঠিক ১১ ডিজিটের ফোন নম্বর লিখুন");
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

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const cleanPhone = phone.trim().replace(/^(\+?880)/, "0");
      await register({
        name: name.trim(),
        phone: cleanPhone,
        password,
        target,
      });
    } catch (err: any) {
      Alert.alert("নিবন্ধন ব্যর্থ হয়েছে", err.message || "অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header title="নিবন্ধন" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>নতুন অ্যাকাউন্ট তৈরি করো</Text>
          <Text style={styles.subtitle}>
            পরীক্ষালয়ের সাথে শুরু হোক তোমার স্বপ্নের প্রস্তুতি
          </Text>
        </View>

        <View style={styles.formCard}>
          <Input
            label="তোমার পুরো নাম"
            placeholder="নাম লিখুন"
            value={name}
            onChangeText={(txt) => {
              setName(txt);
              if (nameError) setNameError("");
            }}
            error={nameError}
            leftIcon={<User size={18} color={colors.textSecondary} />}
          />

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
          />

          <Text style={styles.targetLabel}>তোমার লক্ষ্য / কোর্স নির্বাচন করো</Text>
          <View style={styles.targetsWrapper}>
            {ACADEMIC_TARGETS.map((item) => {
              const selected = target === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => setTarget(item.id)}
                  style={[
                    styles.targetChip,
                    selected && styles.targetChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.targetChipText,
                      selected && styles.targetChipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Input
            label="পাসওয়ার্ড"
            placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
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
            title="অ্যাকাউন্ট তৈরি সম্পন্ন করো"
            onPress={handleRegister}
            loading={loading}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>ইতিমধ্যে অ্যাকাউন্ট আছে? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>লগইন করো</Text>
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
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  targetLabel: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  targetsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  targetChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  targetChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  targetChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  targetChipTextSelected: {
    color: colors.primary,
    fontFamily: fontFamilies.bold,
    fontWeight: "700",
  },
  submitBtn: {
    marginTop: spacing.md,
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  promptText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.body,
    fontFamily: fontFamilies.bold,
    color: colors.primary,
    fontWeight: "700",
  },
});
