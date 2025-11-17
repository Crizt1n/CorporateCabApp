// config/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// --------------------------------------
// Firebase Config
// --------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCLRAWyV2N4YEtES3vQf7JF8AAIwEnbBJo",
  authDomain: "corporatecabapp.firebaseapp.com",
  projectId: "corporatecabapp",
  storageBucket: "corporatecabapp.appspot.com",
  messagingSenderId: "860235874548",
  appId: "1:860235874548:web:181b9f6bdb737468a5dea1",
  measurementId: "G-D3JWP8ZDXF",
};

// --------------------------------------
// Initialize Firebase App
// --------------------------------------
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --------------------------------------
// Initialize Auth (with AsyncStorage persistence)
// --------------------------------------
let authInstance;

try {
  // If already initialized (Fast Refresh)
  authInstance = getAuth(app);
} catch (e) {
  // First initialization
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const auth = authInstance;

// --------------------------------------
// Initialize Firestore (NO persistence!)
// React Native does NOT support IndexedDB.
// --------------------------------------
export const db = getFirestore(app);
