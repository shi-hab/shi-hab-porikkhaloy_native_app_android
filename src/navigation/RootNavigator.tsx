import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { ExamLiveScreen } from "../screens/exam/ExamLiveScreen";
import { ExamResultScreen } from "../screens/exam/ExamResultScreen";
import { MockTestWizardScreen } from "../screens/mockTest/MockTestWizardScreen";
import { PackageDetailScreen } from "../screens/packages/PackageDetailScreen";
import { LeaderboardScreen } from "../screens/leaderboard/LeaderboardScreen";
import { StreakScreen } from "../screens/dashboard/StreakScreen";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="ExamLive"
            component={ExamLiveScreen}
            options={{
              gestureEnabled: false, // Prevent accidental swipe-to-dismiss during live exam
            }}
          />
          <Stack.Screen name="ExamResult" component={ExamResultScreen} />
          <Stack.Screen name="MockTestWizard" component={MockTestWizardScreen} />
          <Stack.Screen name="PackageDetail" component={PackageDetailScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Streak" component={StreakScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
