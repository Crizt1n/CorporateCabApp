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

      <Modal
        visible={editingDay !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingDay(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingTop: insets.top + 16 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add Slot for{" "}
                {editingDay?.charAt(0).toUpperCase() +
                  editingDay?.slice(1)}
              </Text>
              <TouchableOpacity onPress={() => setEditingDay(null)}>
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalFormContent}
            >
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Pickup Time (HH:MM)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="09:00"
                  placeholderTextColor={Colors.light.placeholder}
                  value={pickupTime}
                  onChangeText={setPickupTime}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Drop Time (HH:MM)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="17:00"
                  placeholderTextColor={Colors.light.placeholder}
                  value={dropTime}
                  onChangeText={setDropTime}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Pickup Location</Text>
                <View style={styles.locationButtons}>
                  <TouchableOpacity
                    style={[
                      styles.locationButton,
                      pickupLocation === "home" && styles.locationButtonActive,
                    ]}
                    onPress={() => setPickupLocation("home")}
                  >
                    <Home
                      size={16}
                      color={
                        pickupLocation === "home"
                          ? "#FFFFFF"
                          : Colors.light.text
                      }
                    />
                    <Text
                      style={[
                        styles.locationButtonText,
                        pickupLocation === "home" &&
                          styles.locationButtonTextActive,
                      ]}
                    >
                      Home
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.locationButton,
                      pickupLocation === "office" &&
                        styles.locationButtonActive,
                    ]}
                    onPress={() => setPickupLocation("office")}
                  >
                    <Building
                      size={16}
                      color={
                        pickupLocation === "office"
                          ? "#FFFFFF"
                          : Colors.light.text
                      }
                    />
                    <Text
                      style={[
                        styles.locationButtonText,
                        pickupLocation === "office" &&
                          styles.locationButtonTextActive,
                      ]}
                    >
                      Office
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Drop Location</Text>
                <View style={styles.locationButtons}>
                  <TouchableOpacity
                    style={[
                      styles.locationButton,
                      dropLocation === "home" && styles.locationButtonActive,
                    ]}
                    onPress={() => setDropLocation("home")}
                  >
                    <Home
                      size={16}
                      color={
                        dropLocation === "home" ? "#FFFFFF" : Colors.light.text
                      }
                    />
                    <Text
                      style={[
                        styles.locationButtonText,
                        dropLocation === "home" &&
                          styles.locationButtonTextActive,
                      ]}
                    >
                      Home
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.locationButton,
                      dropLocation === "office" && styles.locationButtonActive,
                    ]}
                    onPress={() => setDropLocation("office")}
                  >
                    <Building
                      size={16}
                      color={
                        dropLocation === "office"
                          ? "#FFFFFF"
                          : Colors.light.text
                      }
                    />
                    <Text
                      style={[
                        styles.locationButtonText,
                        dropLocation === "office" &&
                          styles.locationButtonTextActive,
                      ]}
                    >
                      Office
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditingDay(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveSlot}
              >
                <Text style={styles.saveButtonText}>Save Slot</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                        <View style={styles.slotDetails}>
                          <View style={styles.slotTime}>
                            <Clock
                              size={14}
                              color={Colors.light.textSecondary}
                            />
                            <Text style={styles.slotText}>
                              {slot.pickupTime} - {slot.dropTime}
                            </Text>
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
                              {slot.pickupLocation === "home"
                                ? "Home"
                                : "Office"}{" "}
                              →{" "}
                              {slot.dropLocation === "home"
                                ? "Home"
                                : "Office"}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveSlot(index)}
                          style={styles.removeSlotButton}
                        >
                          <X size={14} color={Colors.light.error} />
                        </TouchableOpacity>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    minHeight: "60%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.light.text,
    flex: 1,
  },
  modalBody: {
    flex: 1,
  },
  modalFormContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 18,
  },
  formGroup: {
    gap: 7,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  textInput: {
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: Colors.light.text,
  },
  locationButtons: {
    flexDirection: "row",
    gap: 10,
  },
  locationButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 9,
    backgroundColor: Colors.light.cardBackground,
  },
  locationButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  locationButtonText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  locationButtonTextActive: {
    color: "#FFFFFF",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 9,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: Colors.light.primary,
    borderRadius: 9,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FFFFFF",
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
    gap: 12,
  },
  slotItem: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotDetails: {
    flex: 1,
    gap: 6,
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
    fontWeight: "500" as const,
  },
  removeSlotButton: {
    padding: 8,
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
