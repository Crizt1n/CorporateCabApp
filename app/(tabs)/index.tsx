import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MapPin,
  Phone,
  AlertCircle,
  Clock,
  Car,
  Navigation,
  CheckCircle,
  User,
  ChevronRight,
} from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";
import type { Trip } from "@/types";

// Mock upcoming trips data
const getMockTrips = (userId: string): Trip[] => [
  {
    id: "trip-001",
    userId,
    scheduleId: "sched-001",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    driverName: "Raj Kumar",
    driverPhone: "+91-9876543210",
    vehicleNumber: "DL 1C AB 1234",
    pickupLocation: {
      street: "123 Home Street",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110001",
      coordinates: {
        latitude: 28.7041,
        longitude: 77.1025,
      },
      formattedAddress: "123 Home Street, Delhi, Delhi 110001",
    },
    dropLocation: {
      street: "Tech Park, Building A",
      city: "Gurgaon",
      state: "Haryana",
      zipCode: "122001",
      coordinates: {
        latitude: 28.4595,
        longitude: 77.1542,
      },
      formattedAddress: "Tech Park, Building A, Gurgaon, Haryana 122001",
    },
    estimatedPickupTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: "scheduled",
  },
  {
    id: "trip-002",
    userId,
    scheduleId: "sched-002",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    driverName: "Priya Singh",
    driverPhone: "+91-9876543211",
    vehicleNumber: "DL 1C CD 5678",
    pickupLocation: {
      street: "456 Office Plaza",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110002",
      coordinates: {
        latitude: 28.5244,
        longitude: 77.1855,
      },
      formattedAddress: "456 Office Plaza, Delhi, Delhi 110002",
    },
    dropLocation: {
      street: "123 Home Street",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110001",
      coordinates: {
        latitude: 28.7041,
        longitude: 77.1025,
      },
      formattedAddress: "123 Home Street, Delhi, Delhi 110001",
    },
    estimatedPickupTime: new Date(new Date().setDate(new Date().getDate() + 3)),
    status: "scheduled",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userProfile } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.uid) {
      const mockTrips = getMockTrips(userProfile.uid);
      setTrips(mockTrips);
      setLoading(false);
    }
  }, [userProfile?.uid]);

  const handleSOSPress = (tripId: string) => {
    Alert.alert("Emergency SOS Activated", "Contacting emergency services...", [
      {
        text: "Call Driver",
        onPress: () => {
          Alert.alert("Calling", "Dialing driver...");
        },
      },
      {
        text: "Emergency Contact",
        onPress: () => {
          Alert.alert("Contacting", "Calling emergency contact...");
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleTrackingPress = (trip: Trip) => {
    setSelectedTripId(trip.id);
    Alert.alert(
      "Live Tracking",
      `Tracking ${trip.driverName}'s vehicle (${trip.vehicleNumber})\n\nCurrent ETA: ~${Math.floor(Math.random() * 20) + 5} minutes`
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return Colors.light.success;
      case "en_route":
        return Colors.light.warning;
      case "scheduled":
        return Colors.light.primary;
      case "cancelled":
        return Colors.light.error;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.replace("_", " ").slice(1);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.greeting}>
            Hello, {userProfile?.name || "User"}!
          </Text>
          <Text style={styles.subtitle}>Your upcoming trips</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.light.primary}
          />
        </View>
      ) : trips.length === 0 ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.emptyContent}
        >
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Car size={48} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No Upcoming Trips</Text>
            <Text style={styles.emptySubtitle}>
              Submit your schedule to book a cab
            </Text>
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => router.push("/schedule")}
            >
              <Text style={styles.scheduleButtonText}>Go to Schedule</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          {trips.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View>
                  <Text style={styles.tripDate}>{formatDate(trip.date)}</Text>
                  <Text style={styles.tripTime}>
                    {formatTime(trip.estimatedPickupTime)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(trip.status) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(trip.status) },
                    ]}
                  >
                    {getStatusLabel(trip.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.driverSection}>
                <View style={styles.driverInfo}>
                  <View style={styles.driverAvatar}>
                    <User size={20} color={Colors.light.primary} />
                  </View>
                  <View style={styles.driverDetails}>
                    <Text style={styles.driverName}>{trip.driverName}</Text>
                    <Text style={styles.driverPhone}>{trip.driverPhone}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => Alert.alert("Calling", trip.driverName)}
                >
                  <Phone size={16} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.vehicleSection}>
                <View style={styles.vehicleIcon}>
                  <Car size={18} color={Colors.light.primary} />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleLabel}>Vehicle</Text>
                  <Text style={styles.vehicleNumber}>{trip.vehicleNumber}</Text>
                </View>
              </View>

              <View style={styles.locationsSection}>
                <View style={styles.locationItem}>
                  <MapPin size={18} color={Colors.light.success} />
                  <View style={styles.locationDetails}>
                    <Text style={styles.locationLabel}>Pickup</Text>
                    <Text style={styles.locationAddress} numberOfLines={1}>
                      {trip.pickupLocation.formattedAddress}
                    </Text>
                  </View>
                </View>

                <View style={styles.routeLine} />

                <View style={styles.locationItem}>
                  <MapPin size={18} color={Colors.light.error} />
                  <View style={styles.locationDetails}>
                    <Text style={styles.locationLabel}>Drop</Text>
                    <Text style={styles.locationAddress} numberOfLines={1}>
                      {trip.dropLocation.formattedAddress}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionsSection}>
                <TouchableOpacity
                  style={styles.trackingButton}
                  onPress={() => handleTrackingPress(trip)}
                >
                  <Navigation size={16} color="#FFFFFF" />
                  <Text style={styles.trackingButtonText}>Live Tracking</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sosButton}
                  onPress={() => handleSOSPress(trip.id)}
                >
                  <AlertCircle size={16} color={Colors.light.error} />
                  <Text style={styles.sosButtonText}>SOS</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.detailsLink}
                onPress={() =>
                  Alert.alert("Trip Details", `Trip ID: ${trip.id}`)
                }
              >
                <Text style={styles.detailsLinkText}>View Full Details</Text>
                <ChevronRight size={16} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.safetyCard}>
            <View style={styles.safetyContent}>
              <View style={styles.safetyIcon}>
                <AlertCircle size={24} color={Colors.light.error} />
              </View>
              <View style={styles.safetyText}>
                <Text style={styles.safetyTitle}>Safety First</Text>
                <Text style={styles.safetySubtitle}>
                  Share your trip with a trusted contact
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.safetyAction}>
              <Text style={styles.safetyActionText}>Share Trip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
  greeting: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary + "10",
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
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  scheduleButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  tripCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tripDate: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  tripTime: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  driverSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  driverDetails: {
    gap: 2,
  },
  driverName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  driverPhone: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.light.background,
    padding: 12,
    borderRadius: 10,
  },
  vehicleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleInfo: {
    gap: 2,
  },
  vehicleLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  vehicleNumber: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  locationsSection: {
    gap: 12,
    paddingVertical: 8,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  locationDetails: {
    flex: 1,
    gap: 2,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  locationAddress: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: "500" as const,
  },
  routeLine: {
    height: 24,
    width: 2,
    backgroundColor: Colors.light.border,
    marginLeft: 9,
  },
  actionsSection: {
    flexDirection: "row",
    gap: 12,
  },
  trackingButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  trackingButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  sosButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.light.error + "10",
    paddingVertical: 12,
    borderRadius: 10,
  },
  sosButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.error,
  },
  detailsLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
  },
  detailsLinkText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  safetyCard: {
    backgroundColor: Colors.light.error + "10",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  safetyContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  safetyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.error + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  safetyText: {
    flex: 1,
    gap: 2,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  safetySubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  safetyAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.error + "20",
    borderRadius: 6,
  },
  safetyActionText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.error,
  },
});
