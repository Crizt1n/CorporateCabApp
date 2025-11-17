import { Tabs, Redirect } from "expo-router";
import {
  Home,
  Calendar,
  Bot,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  User,
} from "lucide-react-native";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";

const TabBarIcon = ({
  icon: Icon,
  color,
  size,
}: {
  icon: React.ElementType;
  color: string;
  size: number;
}) => <Icon color={color} size={size} />;

export default function TabLayout() {
  const { isEmployee, isAdmin, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!isEmployee && !isAdmin) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.gray,
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "index") iconName = Home;
          else if (route.name === "schedule") iconName = Calendar;
          else if (route.name === "assistant") iconName = Bot;
          else if (route.name === "settings") iconName = Settings;
          else if (route.name === "admin-dashboard") iconName = LayoutDashboard;
          else if (route.name === "admin-approvals") iconName = ShieldCheck;
          else return null;
          return <TabBarIcon icon={iconName} color={color} size={size} />;
        },
      })}
    >
      {isEmployee && (
        <>
          <Tabs.Screen name="index" options={{ title: "Home" }} />
          <Tabs.Screen name="schedule" options={{ title: "Schedule" }} />
          <Tabs.Screen name="assistant" options={{ title: "Assistant" }} />
          <Tabs.Screen name="settings" options={{ title: "Settings" }} />
        </>
      )}

      {isAdmin && (
        <>
          <Tabs.Screen
            name="admin-dashboard"
            options={{ title: "Dashboard" }}
          />
          <Tabs.Screen
            name="admin-approvals"
            options={{ title: "Approvals" }}
          />
          <Tabs.Screen
            name="settings"
            options={{ title: "Settings", tabBarIcon: ({ color, size }) => <TabBarIcon icon={User} color={color} size={size} /> }}
          />
        </>
      )}

      {/* Hide all non-relevant screens */}
      {!isEmployee && (
        <>
          <Tabs.Screen name="index" options={{ href: null }} />
          <Tabs.Screen name="schedule" options={{ href: null }} />
          <Tabs.Screen name="assistant" options={{ href: null }} />
        </>
      )}
      {!isAdmin && (
        <>
          <Tabs.Screen name="admin-dashboard" options={{ href: null }} />
          <Tabs.Screen name="admin-approvals" options={{ href: null }} />
        </>
      )}
    </Tabs>
  );
}
