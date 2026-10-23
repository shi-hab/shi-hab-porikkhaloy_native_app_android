import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Sparkles,
  Send,
  Image as ImageIcon,
  X,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  BookOpen,
  HeartPulse,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { aiService } from "../../services/aiService";
import { AIMessage, AIUsage } from "../../types/ai";
import { colors } from "../../theme/colors";
import { radii, spacing, shadows } from "../../theme/spacing";
import { fontFamilies, typography } from "../../theme/typography";
import { toBn } from "../../utils/banglaNumber";

export const PoriAIChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [assistantType, setAssistantType] = useState<"education" | "health">("education");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [usage, setUsage] = useState<AIUsage | null>(null);
  const [sending, setSending] = useState(false);
  const [conversationUuid, setConversationUuid] = useState<string | undefined>(undefined);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Load initial usage and welcome message
    aiService
      .getUsage()
      .then((u) => setUsage(u))
      .catch(() => {});

    setMessages([
      {
        id: "welcome",
        sender: "assistant",
        message:
          "হ্যালো! আমি 'পরী এআই'। পড়াশোনার যেকোনো জটিল টপিক, সূত্রের ব্যাখ্যা বা কোনো প্রশ্নের ছবি তুলে আমাকে পাঠাতে পারো—আমি সমাধান বুঝিয়ে দেব!",
        created_at: new Date().toISOString(),
      },
    ]);
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert("ত্রুটি", "ছবি নির্বাচন করা যায়নি। গ্যালারি পারমিশন পরীক্ষা করুন।");
    }
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text && !selectedImage) return;
    if (sending) return;

    const userMsg: AIMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      message: text,
      attachment_url: selectedImage || undefined,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    const imgToSend = selectedImage;
    setSelectedImage(null);
    setSending(true);

    try {
      const res = await aiService.sendMessage({
        message: text || "অনুগ্রহ করে এই ছবির প্রশ্নটি সমাধান করে বুঝিয়ে দিন।",
        conversation_uuid: conversationUuid,
        assistant_type: assistantType,
        imageUri: imgToSend || undefined,
      });

      if (res.reply) {
        setMessages((prev) => [...prev, res.reply]);
        if (res.reply.conversation_id) {
          setConversationUuid(res.reply.conversation_id);
        }
      }

      // Refresh remaining quota
      aiService.getUsage().then(setUsage).catch(() => {});
    } catch (err: any) {
      Alert.alert(
        "বার্তা পাঠানো যায়নি",
        err.message || "ইন্টারনেট সংযোগ চেক করে পুনরায় চেষ্টা করুন।"
      );
    } finally {
      setSending(false);
    }
  };

  const handleFeedback = (messageId: string | number, feedback: "like" | "dislike") => {
    aiService.provideFeedback(messageId, feedback).catch(() => {});
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback } : m))
    );
  };

  const renderMessageItem = ({ item }: { item: AIMessage }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowAI,
        ]}
      >
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Sparkles size={16} color="#0F172A" />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          {item.attachment_url ? (
            <Image
              source={{ uri: item.attachment_url }}
              style={styles.attachedImage}
              resizeMode="cover"
            />
          ) : null}

          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.aiMessageText,
            ]}
          >
            {item.message}
          </Text>

          {!isUser && item.id !== "welcome" && (
            <View style={styles.feedbackRow}>
              <TouchableOpacity
                onPress={() => handleFeedback(item.id, "like")}
                style={styles.feedbackBtn}
              >
                <ThumbsUp
                  size={14}
                  color={item.feedback === "like" ? colors.primary : colors.textMuted}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFeedback(item.id, "dislike")}
                style={styles.feedbackBtn}
              >
                <ThumbsDown
                  size={14}
                  color={item.feedback === "dislike" ? colors.danger : colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>পরী এআই (Pori AI)</Text>
          <Text style={styles.creditsText}>
            বাকি আছে: {toBn(usage?.remaining_credits ?? 20)}টি প্রশ্ন
          </Text>
        </View>

        {/* Assistant Switcher */}
        <View style={styles.typeSwitcher}>
          <TouchableOpacity
            onPress={() => setAssistantType("education")}
            style={[
              styles.switchBtn,
              assistantType === "education" && styles.switchBtnActive,
            ]}
          >
            <BookOpen
              size={14}
              color={assistantType === "education" ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.switchBtnText,
                assistantType === "education" && styles.switchBtnTextActive,
              ]}
            >
              পড়ালেখা
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setAssistantType("health")}
            style={[
              styles.switchBtn,
              assistantType === "health" && styles.switchBtnActive,
            ]}
          >
            <HeartPulse
              size={14}
              color={assistantType === "health" ? colors.danger : colors.textSecondary}
            />
            <Text
              style={[
                styles.switchBtnText,
                assistantType === "health" && styles.switchBtnTextActive,
              ]}
            >
              স্বাস্থ্য
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Active Attachment Preview */}
      {selectedImage && (
        <View style={styles.imagePreviewBar}>
          <Image source={{ uri: selectedImage }} style={styles.thumbImage} />
          <Text style={styles.attachedText}>ছবি সংযুক্ত হয়েছে</Text>
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            style={styles.removeImageBtn}
          >
            <X size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Message Composer */}
      <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.xs }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePickImage}
          style={styles.attachBtn}
        >
          <ImageIcon size={22} color={colors.primary} />
        </TouchableOpacity>

        <TextInput
          placeholder="তোমার প্রশ্ন লিখুন..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          style={styles.textInput}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={(!inputText.trim() && !selectedImage) || sending}
          onPress={handleSendMessage}
          style={[
            styles.sendBtn,
            (!inputText.trim() && !selectedImage) || sending ? styles.sendBtnDisabled : null,
          ]}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Send size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  creditsText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  typeSwitcher: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.full,
    padding: 3,
    gap: 2,
  },
  switchBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    gap: 4,
  },
  switchBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.subtle,
  },
  switchBtnText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  switchBtnTextActive: {
    color: colors.textPrimary,
    fontFamily: fontFamilies.bold,
    fontWeight: "700",
  },
  messagesList: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: spacing.xs,
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowAI: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    marginTop: 2,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: radii.xs,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.subtle,
  },
  attachedImage: {
    width: 200,
    height: 140,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  messageText: {
    ...typography.body,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.textInverted,
  },
  aiMessageText: {
    color: colors.textPrimary,
  },
  feedbackRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  feedbackBtn: {
    padding: 2,
  },
  imagePreviewBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  thumbImage: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    marginRight: spacing.sm,
  },
  attachedText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  removeImageBtn: {
    padding: spacing.xs,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  attachBtn: {
    padding: spacing.xs,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
});
