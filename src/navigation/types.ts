import { NavigatorScreenParams } from "@react-navigation/native";
import { Exam, ExamResultResponse, Question } from "../types/exam";
import { Package } from "../types/package";

export type MainTabParamList = {
  HomeTab: undefined;
  QuestionBankTab: undefined;
  MockTestTab: undefined;
  PoriAITab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  // Main Tabs
  MainTabs: NavigatorScreenParams<MainTabParamList>;

  // Exam
  ExamLive: {
    exam: Exam;
    questions: Question[];
    resumedAnswers?: Record<string | number, number | string>;
  };
  ExamResult: {
    result: ExamResultResponse;
  };

  // Mock Test Wizard
  MockTestWizard: undefined;

  // Package & Details
  PackageDetail: {
    pkg: Package;
  };

  // Leaderboard & Streak
  Leaderboard: undefined;
  Streak: undefined;
};
