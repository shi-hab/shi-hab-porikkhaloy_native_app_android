import { TextStyle, Platform } from "react-native";

export const fontFamilies = {
  regular: Platform.select({
    ios: "HindSiliguri-Regular",
    android: "HindSiliguri-Regular",
    default: "System",
  }),
  bold: Platform.select({
    ios: "HindSiliguri-Bold",
    android: "HindSiliguri-Bold",
    default: "System",
  }),
};

export const typography: Record<string, TextStyle> = {
  display: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    lineHeight: 42,
    fontWeight: "700",
  },
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700",
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "700",
  },
  h3: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
  },
  button: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  badge: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
  },
};
