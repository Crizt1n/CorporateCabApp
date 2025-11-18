import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Phone,
  Clock,
  AlertCircle,
} from "lucide-react-native";
import { TrackingMap } from "./TrackingMap";
import Colors from "@/constants/colors";
import type { Trip } from "@/types";

// Mock trip data for testing
const mockTrip: Trip = {
  id: "trip-001",
  userId: "user1",
  scheduleId: "sched-001",
  date: new Date(),
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
  estimatedPickupTime: new Date(),
  status: "en_route",
  currentLocation: {
    latitude: 28.65,
    longitude: 77.115,
  },
};

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const trip = mockTrip;
  const mapRef = useRef<MapView>(null);

  const [currentLocation, setCurrentLocation] = useState(
    trip.currentLocation || trip.pickupLocation.coordinates
  );
  const [eta, setEta] = useState(8);
  const [isSimulating, setIsSimulating] = useState(true);

  // Simulate vehicle movement
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setCurrentLocation((prev) => {
        if (!prev) return trip.pickupLocation.coordinates;

        const pickupCoords = trip.pickupLocation.coordinates;
        const dropCoords = trip.dropLocation.coordinates;

        // Calculate progress and move towards destination
        const latDiff = dropCoords.latitude - pickupCoords.latitude;
        const lonDiff = dropCoords.longitude - pickupCoords.longitude;

        const newLat = prev.latitude + latDiff * 0.02;
        const newLon = prev.longitude + lonDiff * 0.02;

        // Check if we've reached destination
        const distance = Math.sqrt(
          Math.pow(newLat - dropCoords.latitude, 2) +
            Math.pow(newLon - dropCoords.longitude, 2)
        );

        if (distance < 0.01) {
          setIsSimulating(false);
          setEta(0);
          return dropCoords;
        }

        return { latitude: newLat, longitude: newLon };
      });

      setEta((prev) => Math.max(0, prev - 0.5));
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating]);


  const handleCall = () => {
    alert(`Calling ${trip.driverName}...`);
  };

  const handleSOS = () => {
    alert("Emergency services alerted. Help is on the way.");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Google Maps with Web Fallback */}
      <MapComponent
        ref={mapRef}
        trip={trip}
        currentLocation={currentLocation}
        eta={eta}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Bottom Sheet */}
      <View
        style={[styles.bottomSheet, { paddingBottom: insets.bottom || 16 }]}
      >
        <ScrollView style={styles.bottomSheetContent} scrollEnabled={false}>
          {/* Trip Info */}
          <View style={styles.tripInfo}>
            <View style={styles.driverCard}>
              <View>
                <Text style={styles.driverName}>{trip.driverName}</Text>
                <Text style={styles.vehicleNumber}>{trip.vehicleNumber}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>4.8★</Text>
              </View>
            </View>

            {/* ETA and Status */}
            <View style={styles.etaContainer}>
              <View style={styles.etaItem}>
                <Clock size={18} color={Colors.light.primary} />
                <View>
                  <Text style={styles.etaLabel}>ETA</Text>
                  <Text style={styles.etaValue}>
                    {Math.ceil(eta)} min{" "}
                    {trip.status === "en_route" ? "away" : ""}
                  </Text>
                </View>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {trip.status === "en_route"
                    ? "On the way"
                    : trip.status === "picked_up"
                      ? "Picked up"
                      : "Completed"}
                </Text>
              </View>
            </View>

            {/* Locations */}
            <View style={styles.locationsContainer}>
              <View style={styles.locationItem}>
                <View style={styles.locationDot}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: Colors.light.success },
                    ]}
                  />
                </View>
                <View style={styles.locationText}>
                  <Text style={styles.locationLabel}>Pickup</Text>
                  <Text style={styles.locationAddress} numberOfLines={1}>
                    {trip.pickupLocation.formattedAddress}
                  </Text>
                </View>
              </View>

              <View style={styles.dotLine} />

              <View style={styles.locationItem}>
                <View style={styles.locationDot}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: Colors.light.error },
                    ]}
                  />
                </View>
                <View style={styles.locationText}>
                  <Text style={styles.locationLabel}>Drop</Text>
                  <Text style={styles.locationAddress} numberOfLines={1}>
                    {trip.dropLocation.formattedAddress}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Phone size={20} color="#FFFFFF" />
              <Text style={styles.callButtonText}>Call Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
              <AlertCircle size={20} color={Colors.light.error} />
              <Text style={styles.sosButtonText}>Emergency SOS</Text>
            </TouchableOpacity>
          </View>

          {/* Safety Info */}
          <View style={styles.safetyInfo}>
            <Text style={styles.safetyTitle}>💡 Share your real-time location</Text>
            <Text style={styles.safetyText}>
              Send live tracking link to a trusted contact for added safety
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.cardBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
    minHeight: "35%",
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomSheetContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tripInfo: {
    gap: 12,
  },
  driverCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  driverName: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  vehicleNumber: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 3,
  },
  ratingBadge: {
    backgroundColor: Colors.light.warning + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.warning,
  },
  etaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  etaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  etaLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  etaValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: Colors.light.success + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.success,
  },
  locationsContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  locationItem: {
    flexDirection: "row",
    gap: 12,
  },
  locationDot: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationText: {
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
  dotLine: {
    marginLeft: 6,
    width: 2,
    height: 16,
    backgroundColor: Colors.light.border,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 8,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  callButtonText: {
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
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  sosButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.error,
  },
  safetyInfo: {
    backgroundColor: Colors.light.info + "10",
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  safetyText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
