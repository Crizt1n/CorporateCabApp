import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Map } from "lucide-react-native";
import Colors from "@/constants/colors";
import type { Trip } from "@/types";

interface MapComponentProps {
  trip: Trip;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  eta: number;
}

export const MapComponent = React.forwardRef<View, MapComponentProps>(
  ({ trip, eta }, ref) => {
    return (
      <View ref={ref} style={styles.mapFallback}>
        <View style={styles.mapPlaceholder}>
          <Map size={48} color={Colors.light.primary} />
          <Text style={styles.mapPlaceholderText}>Live Map Tracking</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            {trip.driverName} is {Math.ceil(eta)} minutes away
          </Text>

          <View style={styles.routeInfo}>
            <View style={styles.routePoint}>
              <View style={styles.routePointDot} />
              <View>
                <Text style={styles.routePointLabel}>From</Text>
                <Text style={styles.routePointAddress} numberOfLines={1}>
                  {trip.pickupLocation.city}
                </Text>
              </View>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.routePoint}>
              <View
                style={[
                  styles.routePointDot,
                  { backgroundColor: Colors.light.error },
                ]}
              />
              <View>
                <Text style={styles.routePointLabel}>To</Text>
                <Text style={styles.routePointAddress} numberOfLines={1}>
                  {trip.dropLocation.city}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.mapSimulation}>
            <View
              style={[
                styles.vehicleSimulator,
                { left: `${(1 - eta / 8) * 80}%` },
              ]}
            >
              <Text style={styles.vehicleEmoji}>🚗</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  mapFallback: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  mapPlaceholder: {
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  routeInfo: {
    width: "100%",
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  routePointDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.light.success,
  },
  routePointLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  routePointAddress: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500" as const,
    marginTop: 2,
  },
  routeLine: {
    marginLeft: 6,
    width: 2,
    height: 24,
    backgroundColor: Colors.light.border,
  },
  mapSimulation: {
    width: "100%",
    height: 80,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
  },
  vehicleSimulator: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleEmoji: {
    fontSize: 28,
  },
});
