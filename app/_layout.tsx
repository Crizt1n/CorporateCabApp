import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { user, userProfile, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;

    console.log("Navigation check:", {
      hasUser: !!user,
      hasProfile: !!userProfile,
      hasCompletedOnboarding: userProfile?.hasCompletedOnboarding,
      currentSegments: segments,
    });

    const inAuthGroup = segments[0] === "(tabs)";
    const onLogin = segments[0] === "login";
    const onOnboarding = segments[0] === "onboarding";

    if (!user && !onLogin) {
      console.log("Redirecting to login");
      router.replace("/login");
    } else if (user && !userProfile?.hasCompletedOnboarding && !onOnboarding) {
      console.log("Redirecting to onboarding");
      router.replace("/onboarding");
    } else if (user && userProfile?.hasCompletedOnboarding && !inAuthGroup) {
      console.log("Redirecting to app");
      router.replace("/(tabs)");
    }
  }, [user, userProfile, initializing, segments]);

  useEffect(() => {
    if (!initializing) {
      SplashScreen.hideAsync();
    }
  }, [initializing]);

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}
