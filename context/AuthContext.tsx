import createContextHook from "@nkzw/create-context-hook";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { auth, db } from "@/config/firebase";
import { UserProfile, UserRole } from "@/types";

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initializing, setInitializing] = useState<boolean>(true);

  // Prevent profile from loading twice
  const isLoadingProfile = useRef(false);

  useEffect(() => {
    console.log("Setting up auth state listener");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.email);

      setUser(firebaseUser);

      if (firebaseUser && !isLoadingProfile.current) {
        isLoadingProfile.current = true;
        await loadUserProfile(firebaseUser.uid);
        isLoadingProfile.current = false;
      } else {
        setUserProfile(null);
      }

      setLoading(false);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  // ---- Loads the Firestore user profile ----
  const loadUserProfile = async (uid: string) => {
    try {
      console.log("Loading user profile for:", uid);
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          uid,
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: data.role as UserRole,
          homeAddress: data.homeAddress,
          hasCompletedOnboarding: data.hasCompletedOnboarding || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
        console.log("User profile loaded:", data.role);
      } else {
        console.log("User profile not found, creating...");

        // ⚡ CREATE A NEW PROFILE AUTOMATICALLY
        const newProfile = {
          email: user?.email || "",
          name: "",
          phone: "",
          role: "employee",
          homeAddress: "",
          hasCompletedOnboarding: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(userRef, newProfile);

        // Load again after creating
        setUserProfile({ uid, ...newProfile });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUserProfile(null);
    }
  };

  // ---- Login ----
  const signIn = useCallback(async (email: string, password: string) => {
    console.log("Signing in user:", email);
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user; // onAuthStateChanged will load profile
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ---- Register ----
  const signUp = useCallback(
    async (email: string, password: string, role: UserRole = "employee") => {
      console.log("Signing up user:", email);
      setLoading(true);

      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const newUserProfile: Omit<UserProfile, "uid"> = {
          email,
          name: "",
          phone: "",
          role,
          homeAddress: "",
          hasCompletedOnboarding: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(doc(db, "users", result.user.uid), newUserProfile);

        return result.user;
      } catch (error) {
        console.error("Sign up error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ---- Logout ----
  const signOut = useCallback(async () => {
    try {
      console.log("Signing out user");
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }, []);

  // ---- Update User Profile ----
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) throw new Error("No user logged in");

      console.log("Updating user profile:", updates);

      try {
        await updateDoc(doc(db, "users", user.uid), {
          ...updates,
          updatedAt: new Date(),
        });

        await loadUserProfile(user.uid);
      } catch (error) {
        console.error("Update profile error:", error);
        throw error;
      }
    },
    [user]
  );

  return useMemo(
    () => ({
      user,
      userProfile,
      loading,
      initializing,
      signIn,
      signUp,
      signOut,
      updateProfile,
      isAuthenticated: !!user,
      isAdmin: userProfile?.role === "admin",
      isEmployee: userProfile?.role === "employee",
    }),
    [
      user,
      userProfile,
      loading,
      initializing,
      signIn,
      signUp,
      signOut,
      updateProfile,
    ]
  );
});
