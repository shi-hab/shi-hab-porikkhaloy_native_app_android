import React from "react";
import { StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home,
  BookOpen,
  PlayCircle,
  Sparkles,
  User,
} from "lucide-react-native";
import { MainTabParamList } from "./types";
import { HomeScreen } from "../screens/dashboard/HomeScreen";
import { QuestionBankScreen } from "../screens/questionBank/QuestionBankScreen";
import { MockTestWizardScreen } from "../screens/mockTest/MockTestWizardScreen";
import { PoriAIChatScreen } from "../screens/ai/PoriAIChatScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { colors } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { spacing } from "../theme/spacing";

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "হোম",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="QuestionBankTab"
        component={QuestionBankScreen}
        options={{
          tabBarLabel: "প্রশ্ন ব্যাংক",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="MockTestTab"
        component={MockTestWizardScreen}
        options={{
          tabBarLabel: "মডেল টেস্ট",
          tabBarIcon: ({ color, size }) => (
            <PlayCircle size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="PoriAITab"
        component={PoriAIChatScreen}
        options={{
          tabBarLabel: "পরী এআই",
          tabBarIcon: ({ color, size }) => (
            <Sparkles size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "প্রোফাইল",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === "ios" ? 88 : 64,
    paddingTop: spacing.xs,
    paddingBottom: Platform.OS === "ios" ? 28 : spacing.xs,
  },
  tabBarLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: "600",
  },
});
