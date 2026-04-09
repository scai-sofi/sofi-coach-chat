import type { ExpoConfig } from "expo/config";

// The canonical origin for expo-router deep links and web URLs.
// Priority: EXPO_PUBLIC_ORIGIN > VERCEL_URL (auto-set by Vercel) > localhost fallback.
function getOrigin(): string {
  if (process.env.EXPO_PUBLIC_ORIGIN) return process.env.EXPO_PUBLIC_ORIGIN;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:8081";
}

// Set via `eas init` — paste your projectId here after running that command.
const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID ?? "";

const config: ExpoConfig = {
  name: "SoFi Coach Chat",
  slug: "mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "mobile",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  // runtimeVersion must be set for EAS Update to work.
  // "appVersion" ties updates to the app version — change version above when
  // making native changes. JS-only changes are always safe to push as updates.
  runtimeVersion: {
    policy: "appVersion",
  },
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: false,
  },
  android: {},
  web: {
    favicon: "./assets/images/icon.png",
  },
  plugins: [
    ["expo-router", { origin: getOrigin() }],
    "expo-font",
    "expo-web-browser",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },
  updates: {
    url: EAS_PROJECT_ID
      ? `https://u.expo.dev/${EAS_PROJECT_ID}`
      : undefined,
  },
};

export default config;
