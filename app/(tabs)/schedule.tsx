import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Calendar as CalendarIcon,
  Clock,
  Home,
  Building,
  Plus,
  X,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import type { DayOfWeek, LocationType } from "@/types";

interface TimeSlot {
  day: DayOfWeek;
  pickupTime: string;
  dropTime: string;
  pickupLocation: LocationType;
  dropLocation: LocationType;
}

const days: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);
  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState<LocationType>("home");
  const [dropLocation, setDropLocation] = useState<LocationType>("office");

  const handleAddSlot = (day: DayOfWeek) => {
    setEditingDay(day);
    setPickupTime("");
    setDropTime("");
    setPickupLocation("home");
    setDropLocation("office");
  };

  const handleSaveSlot = () => {
    if (!editingDay || !pickupTime || !dropTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newSlot: TimeSlot = {
      day: editingDay,
      pickupTime,
      dropTime,
      pickupLocation,
      dropLocation,
    };

    setSlots([...slots, newSlot]);
    setEditingDay(null);
    Alert.alert("Success", `Slot added for ${editingDay}`);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (slots.length === 0) {
      Alert.alert("Error", "Please add at least one slot");
      return;
    }
    Alert.alert("Success", "Schedule submitted for admin approval!");
    setSlots([]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Weekly Schedule</Text>
        <Text style={styles.subtitle}>
          Submit your cab schedule for next week
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.deadlineCard}>
          <CalendarIcon size={20} color={Colors.light.warning} />
          <View style={styles.deadlineContent}>
            <Text style={styles.deadlineTitle}>Submission Deadline</Text>
            <Text style={styles.deadlineText}>Friday, 5:00 PM</Text>
          </View>
        </View>

        <View style={styles.scheduleList}>
          {days.map((day) => (
            <View key={day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddSlot(day)}
                >
                  <Plus size={16} color={Colors.light.primary} />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              {slots.filter((s) => s.day === day).length > 0 ? (
                <View style={styles.slotsContainer}>
                  {slots
                    .filter((s) => s.day === day)
                    .map((slot, index) => (
                      <View key={index} style={styles.slotItem}>
                        <View style={styles.slotTime}>
                          <Clock size={14} color={Colors.light.textSecondary} />
                          <Text style={styles.slotText}>{slot.pickupTime}</Text>
                        </View>
                        <View style={styles.slotLocation}>
                          {slot.pickupLocation === "home" ? (
                            <Home
                              size={14}
                              color={Colors.light.textSecondary}
                            />
                          ) : (
                            <Building
                              size={14}
                              color={Colors.light.textSecondary}
                            />
                          )}
                          <Text style={styles.slotText}>
                            {slot.pickupLocation === "home" ? "Home" : "Office"}
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              ) : (
                <Text style={styles.emptySlot}>No schedule for this day</Text>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            slots.length === 0 && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={slots.length === 0}
        >
          <Text style={styles.submitButtonText}>Submit for Approval</Text>
        </TouchableOpacity>
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
  deadlineCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.light.warning + "10",
    padding: 16,
    borderRadius: 12,
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  deadlineText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  scheduleList: {
    gap: 12,
  },
  dayCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.primary + "20",
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  slotsContainer: {
    gap: 8,
  },
  slotItem: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 8,
  },
  slotTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  slotLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  slotText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  emptySlot: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontStyle: "italic" as const,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
