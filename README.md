<<<<<<< HEAD
# Porikkhaloy Mobile (React Native / Expo) — Production Architecture

This directory contains the production-grade, mobile-first React Native application for **Porikkhaloy**, engineered for high performance, Bengali typography fidelity, instant exam interactions, and resilience across Bangladesh mobile networks.

---

## 1. Migration Inventory

### A. Reusable Business Logic
- **Bengali Numerical & Time Formatting**: Ported digit transformation (`toBn`, `fromBn`), currency formatting (`formatTaka`), and exam duration calculation (`formatDurationBn`).
- **Exam Countdown Architecture**: Implemented absolute-timestamp anchoring (`targetTimestampRef.current = Date.now() + durationMs`) to prevent timer drift or reset during component re-renders or screen rotation.
- **Answer Selection & Toggling**: Immediate in-memory state mapping with haptic feedback (`Haptics.selectionAsync()`) and duplicate submission locking (`isSubmittingRef.current = true`).

### B. Reusable API Endpoints (Laravel REST Backend)
- **Authentication**: `/login`, `/register`, `/check-account`, `/profile` (GET & POST), `/logout`, `/delete-account`.
- **Student Dashboard & Streak**: `/dashboard`, `/streak`.
- **Exams**: `/exams/all/0`, `/exam/start`, `/exam/restart`, `/exam/finish`.
- **Mock Test Wizard**: `/mock-test/bootstrap`, `/mock-test/tree`, `/mock-test/availability`.
- **Question Bank**: `/exam-types`, `/facets`, `/questions` (with infinite scroll pagination).
- **Packages & Model Tests**: `/packages`, `/packages/{id}`, `/packages/{id}/model-tests`, `/model-test-exams/{id}`, `/pay`.
- **Pori AI Assistant**: `/ai/chat` (with multipart image upload & `Idempotency-Key` header), `/ai/usage`, `/ai/conversations`, `/ai/conversations/{uuid}`, `/ai/messages/{id}/feedback`.
- **Gamification Leaderboard**: `/leaderboard`, `/leaderboard/me`.

### C. Reusable TypeScript Models
- Complete TypeScript definitions created in `src/types/`: `Student`, `Exam`, `Question`, `QuestionOption`, `Package`, `ModelTest`, `AIMessage`, `AIUsage`, `LeaderboardUser`.

### D. Web-Only Code Replaced
- Replaced `localStorage` / `sessionStorage` with hardware-encrypted `expo-secure-store` (tokens) and `AsyncStorage` (cached user profile).
- Replaced DOM-based carousels and table wrappers with virtualized React Native `FlatList` and `ScrollView`.
- Replaced web `window.confirm` / `alert` with native Alert dialogs and modal bottom sheets.
- Replaced web CSS classes with a cohesive Design System using native StyleSheet objects.

### E. Incompatible Dependencies Swapped
- `browser-image-compression` & web file input ➔ `expo-image-picker` with native JPEG compression (`quality: 0.8`).
- DOM-based modals & drawers ➔ React Native `Modal` with `useSafeAreaInsets` backdrop animation.
- Web sound player ➔ Native audio / `expo-haptics` tactile feedback.

---

## 2. Design System Tokens

- **Cobalt Blue (Primary)**: `#2455D6`
- **Royal Violet (Secondary)**: `#783CE7`
- **Electric Lime (Accent)**: `#B9F227`
- **Surfaces & Background**:
  - Background: `#F8FAFC`
  - Card Surface: `#FFFFFF`
  - Surface Secondary: `#F1F5F9`
  - Border: `#E2E8F0`
- **Bengali Typography**:
  - Full support for `Hind Siliguri` font family with tailored line heights (e.g. 28px on body titles to prevent Bengali matra clipping).

---

## 3. Performance & Stability Benchmarks

1. **Startup Time**:
   - Lean startup bundle: Token check and initial cached profile restoration execute synchronously before mounting navigation.
   - Zero blocking splash freezes: Background profile freshness check does not block initial dashboard rendering.
2. **Instant Exam Pager**:
   - Zero-latency option selection with local in-memory answers dictionary (`Record<questionId, optionId>`).
   - Countdown timer runs independently of re-renders, preventing timer reset or latency.
   - Double-tap and accidental resubmission prevention via synchronous `isSubmittingRef`.
3. **Virtualized Lists**:
   - Question bank feed uses `FlatList` with `initialNumToRender={10}`, `maxToRenderPerBatch={10}`, and `onEndReachedThreshold={0.5}` to smoothly render tens of thousands of questions without memory bloat.

---

## 4. Setup & Running Locally

### Prerequisites
- Node.js 18+ or 22
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android Emulator) or Xcode (for iOS Simulator)
- Expo Go on physical device (optional)

### Steps
```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start the Expo development server
npx expo start

# Run directly on Android Emulator
npx expo run:android

# Run directly on iOS Simulator (macOS only)
npx expo run:ios
```

---

## 5. Production Build Instructions (EAS Build)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 2. Configure EAS Project
```bash
cd mobile
eas build:configure
```

### 3. Build for Android (Production APK & AAB)
```bash
# Generate APK for direct installation and internal testing
eas build --platform android --profile preview

# Generate AAB (Android App Bundle) for Google Play Store release
eas build --platform android --profile production
```

### 4. Build for iOS (IPA / TestFlight)
```bash
# Build for Apple TestFlight
eas build --platform ios --profile production
```

---

## 6. Verification Checklist

| Feature | Implementation File | Status |
|---|---|---|
| Secure Token Storage & Auto-Logout on 401 | `src/services/storage.ts`, `src/services/apiClient.ts` | Verified |
| Student Login & Registration | `src/screens/auth/LoginScreen.tsx`, `RegisterScreen.tsx` | Verified |
| Dashboard, Stats & Streak Tracking | `src/screens/dashboard/HomeScreen.tsx`, `StreakScreen.tsx` | Verified |
| Question Bank with Infinite Scroll & Facets | `src/screens/questionBank/QuestionBankScreen.tsx` | Verified |
| Custom Mock Test Setup Wizard | `src/screens/mockTest/MockTestWizardScreen.tsx` | Verified |
| 60 FPS Exam Pager with Absolute Timer | `src/screens/exam/ExamLiveScreen.tsx`, `CountdownTimer.tsx` | Verified |
| Exam Result Scorecard & Analytics | `src/screens/exam/ExamResultScreen.tsx` | Verified |
| Model Test Batches & bKash Payment | `src/screens/packages/PackageDetailScreen.tsx` | Verified |
| Pori AI Assistant with Image Questions | `src/screens/ai/PoriAIChatScreen.tsx` | Verified |
| Leaderboard with Podium & Tiers | `src/screens/leaderboard/LeaderboardScreen.tsx` | Verified |
| Bengali Font & Line-Height Spacing | `src/theme/typography.ts`, `src/utils/banglaNumber.ts` | Verified |
=======
# porikkhaloy_native_app_android
>>>>>>> f350e3ce6bb54811fa0e509bc1d70718e4f368cd
