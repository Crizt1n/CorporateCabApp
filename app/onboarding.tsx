import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { MapPin, User, Phone, Mail } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";
import { Address } from "@/types";

export default function OnboardingScreen() {
  const { userProfile, updateProfile } = useAuth();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  const geocodeAddress = async (
    addressText: string
  ): Promise<Address | null> => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          addressText
        )}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;
        const addressComponents = result.address_components;

        const street =
          addressComponents.find((c: { types: string[] }) =>
            c.types.includes("street_number")
          )?.long_name +
          " " +
          addressComponents.find((c: { types: string[] }) =>
            c.types.includes("route")
          )?.long_name;
        const city = addressComponents.find((c: { types: string[] }) =>
          c.types.includes("locality")
        )?.long_name;
        const state = addressComponents.find((c: { types: string[] }) =>
          c.types.includes("administrative_area_level_1")
        )?.short_name;
        const zipCode = addressComponents.find((c: { types: string[] }) =>
          c.types.includes("postal_code")
        )?.long_name;

        return {
          street: street || "",
          city: city || "",
          state: state || "",
          zipCode: zipCode || "",
          coordinates: {
            latitude: location.lat,
            longitude: location.lng,
          },
          formattedAddress: result.formatted_address,
        };
      }

      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const handleComplete = async () => {
    if (!name || !phone || !address) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSaving(true);
    try {
      const geocodedAddress = address;
      // const geocodedAddress = await geocodeAddress(address);

        if (!geocodedAddress) {
          Alert.alert(
            "Error",
            "Could not find the address. Please enter a valid address."
          );
          setSaving(false);
          return;
        }

      await updateProfile({
        name,
        phone,
        homeAddress: geocodedAddress,
        hasCompletedOnboarding: true,
      });

      router.replace("/(tabs)");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <User size={32} color={Colors.light.primary} />
        </View>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          We need a few details to set up your cab service
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <User
              size={20}
              color={Colors.light.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={Colors.light.placeholder}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.inputContainer, styles.inputDisabled]}>
            <Mail
              size={20}
              color={Colors.light.textSecondary}
              style={styles.inputIcon}
            />
            <Text style={styles.inputText}>{userProfile?.email}</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Phone
              size={20}
              color={Colors.light.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={Colors.light.placeholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Home Address</Text>
          <View style={styles.inputContainer}>
            <MapPin
              size={20}
              color={Colors.light.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="123 Main St, City, State 12345"
              placeholderTextColor={Colors.light.placeholder}
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
              multiline
            />
          </View>
          <Text style={styles.hint}>
            Enter your complete address for accurate cab pickup
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleComplete}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Complete Setup</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputDisabled: {
    backgroundColor: Colors.light.inputBackground,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  hint: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
