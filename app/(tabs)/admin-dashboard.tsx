import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Star,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import type { DashboardStats } from "@/types";

const mockStats: DashboardStats = {
  totalScheduledTrips: 245,
  completedTrips: 230,
  missedPickups: 5,
  averageRating: 4.6,
  pendingApprovals: 12,
};

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Overview of cab operations</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.primaryCard]}>
            <Users size={24} color="#FFFFFF" />
            <Text style={styles.statValue}>
              {mockStats.totalScheduledTrips}
            </Text>
            <Text style={styles.statLabel}>Scheduled Trips</Text>
          </View>

          <View style={[styles.statCard, styles.successCard]}>
            <CheckCircle size={24} color="#FFFFFF" />
            <Text style={styles.statValue}>{mockStats.completedTrips}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={[styles.statCard, styles.warningCard]}>
            <Clock size={24} color="#FFFFFF" />
            <Text style={styles.statValue}>{mockStats.pendingApprovals}</Text>
            <Text style={styles.statLabel}>Pending Approvals</Text>
          </View>

          <View style={[styles.statCard, styles.errorCard]}>
            <XCircle size={24} color="#FFFFFF" />
            <Text style={styles.statValue}>{mockStats.missedPickups}</Text>
            <Text style={styles.statLabel}>Missed Pickups</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>

          <View style={styles.metricsCard}>
            <View style={styles.metricItem}>
              <View style={styles.metricIcon}>
                <TrendingUp size={20} color={Colors.light.success} />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Completion Rate</Text>
                <Text style={styles.metricValue}>
                  {(
                    (mockStats.completedTrips / mockStats.totalScheduledTrips) *
                    100
                  ).toFixed(1)}
                  %
                </Text>
              </View>
              <View style={styles.metricBadge}>
                <Text style={styles.metricBadgeText}>+2.3%</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.metricItem}>
              <View style={styles.metricIcon}>
                <Star size={20} color={Colors.light.warning} />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Average Rating</Text>
                <Text style={styles.metricValue}>
                  {mockStats.averageRating.toFixed(1)}
                </Text>
              </View>
              <View style={styles.starRating}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    color={
                      i < Math.floor(mockStats.averageRating)
                        ? Colors.light.warning
                        : Colors.light.border
                    }
                    fill={
                      i < Math.floor(mockStats.averageRating)
                        ? Colors.light.warning
                        : "transparent"
                    }
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsList}>
            <View style={styles.actionItem}>
              <View style={styles.actionDot} />
              <Text style={styles.actionText}>
                Review {mockStats.pendingApprovals} pending schedules
              </Text>
            </View>
            <View style={styles.actionItem}>
              <View style={styles.actionDot} />
              <Text style={styles.actionText}>
                Follow up on {mockStats.missedPickups} missed pickups
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    padding: 20,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: Colors.light.primary,
  },
  successCard: {
    backgroundColor: Colors.light.success,
  },
  warningCard: {
    backgroundColor: Colors.light.warning,
  },
  errorCard: {
    backgroundColor: Colors.light.error,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  metricsCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  metricBadge: {
    backgroundColor: Colors.light.success + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metricBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.success,
  },
  starRating: {
    flexDirection: "row",
    gap: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  actionsList: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
});
