import React, { useRef, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
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

export const MapComponent = React.forwardRef<MapView, MapComponentProps>(
  ({ trip, currentLocation }, ref) => {
    return (
      <MapView
        ref={ref}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        provider="google"
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Pickup Location Marker */}
        <Marker
          coordinate={trip.pickupLocation.coordinates}
          title="Pickup Location"
          description={trip.pickupLocation.formattedAddress}
          pinColor={Colors.light.success}
        />

        {/* Current Vehicle Location Marker */}
        <Marker
          coordinate={currentLocation}
          title={trip.driverName}
          description={trip.vehicleNumber}
        >
          <View style={styles.markerIcon}>
            <Text style={styles.markerEmoji}>🚗</Text>
          </View>
        </Marker>

        {/* Drop Location Marker */}
        <Marker
          coordinate={trip.dropLocation.coordinates}
          title="Drop Location"
          description={trip.dropLocation.formattedAddress}
          pinColor={Colors.light.error}
        />

        {/* Route Polyline */}
        <Polyline
          coordinates={[
            trip.pickupLocation.coordinates,
            currentLocation,
            trip.dropLocation.coordinates,
          ]}
          strokeColor={Colors.light.primary}
          strokeWidth={3}
        />
      </MapView>
    );
  }
);

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
  },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  markerEmoji: {
    fontSize: 24,
  },
});
