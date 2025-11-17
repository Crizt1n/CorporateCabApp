import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import type { ScheduleStatus } from "@/types";

interface PendingSchedule {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  weekStart: string;
  totalSlots: number;
  status: ScheduleStatus;
  submittedAt: string;
}

const mockSchedules: PendingSchedule[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Priya Sharma",
    userEmail: "priya@company.com",
    weekStart: "Dec 25, 2025",
    totalSlots: 10,
    status: "pending",
    submittedAt: "2 hours ago",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Amit Kumar",
    userEmail: "amit@company.com",
    weekStart: "Dec 25, 2025",
    totalSlots: 8,
    status: "pending",
    submittedAt: "5 hours ago",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Sneha Patel",
    userEmail: "sneha@company.com",
    weekStart: "Dec 25, 2025",
    totalSlots: 10,
    status: "pending",
    submittedAt: "1 day ago",
  },
];

export default function AdminApprovalsScreen() {
  const insets = useSafeAreaInsets();
  const [schedules, setSchedules] = useState<PendingSchedule[]>(mockSchedules);

  const handleApprove = (id: string, userName: string) => {
    Alert.alert("Approve Schedule", `Approve schedule for ${userName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: () => {
          setSchedules((prev) =>
            prev.map((s) =>
              s.id === id ? { ...s, status: "approved" as ScheduleStatus } : s
            )
          );
          Alert.alert("Success", `Schedule approved for ${userName}`);
        },
      },
    ]);
  };

  const handleReject = (id: string, userName: string) => {
    Alert.alert("Reject Schedule", `Reject schedule for ${userName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => {
          setSchedules((prev) =>
            prev.map((s) =>
              s.id === id ? { ...s, status: "rejected" as ScheduleStatus } : s
            )
          );
          Alert.alert("Rejected", `Schedule rejected for ${userName}`);
        },
      },
    ]);
  };

  const pendingCount = schedules.filter((s) => s.status === "pending").length;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.title}>Schedule Approvals</Text>
          <Text style={styles.subtitle}>{pendingCount} pending for review</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {schedules
          .filter((s) => s.status === "pending")
          .map((schedule) => (
            <View key={schedule.id} style={styles.scheduleCard}>
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <User size={20} color={Colors.light.primary} />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{schedule.userName}</Text>
                    <Text style={styles.userEmail}>{schedule.userEmail}</Text>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Clock size={14} color={Colors.light.warning} />
                  <Text style={styles.statusText}>Pending</Text>
                </View>
              </View>

              <View style={styles.scheduleInfo}>
                <View style={styles.infoItem}>
                  <Calendar size={16} color={Colors.light.textSecondary} />
                  <Text style={styles.infoText}>
                    Week starting {schedule.weekStart}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {schedule.totalSlots} trips scheduled
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.submittedText}>
                    Submitted {schedule.submittedAt}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleReject(schedule.id, schedule.userName)}
                >
                  <XCircle size={18} color={Colors.light.error} />
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleApprove(schedule.id, schedule.userName)}
                >
                  <CheckCircle size={18} color="#FFFFFF" />
                  <Text style={styles.approveButtonText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        {pendingCount === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <CheckCircle size={48} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>
              There are no pending schedule approvals
            </Text>
          </View>
        )}
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
    gap: 16,
  },
  scheduleCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.warning + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.warning,
  },
  scheduleInfo: {
    gap: 8,
    paddingVertical: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  submittedText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontStyle: "italic" as const,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.light.error + "10",
    paddingVertical: 12,
    borderRadius: 10,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.error,
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.light.success,
    paddingVertical: 12,
    borderRadius: 10,
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.success + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
