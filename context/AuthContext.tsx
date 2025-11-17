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

  // Prevent profile from loading twice and cleanup on unmount
  const isLoadingProfile = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    isMountedRef.current = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.email);

      if (!isMountedRef.current) return;

      setUser(firebaseUser);

      if (firebaseUser && !isLoadingProfile.current) {
        isLoadingProfile.current = true;
        await loadUserProfile(firebaseUser.uid, firebaseUser);
        isLoadingProfile.current = false;
      } else {
        if (isMountedRef.current) {
          setUserProfile(null);
        }
      }

      if (isMountedRef.current) {
        setLoading(false);
        setInitializing(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
  }, []);

  // ---- Loads the Firestore user profile ----
  const loadUserProfile = async (uid: string, firebaseUser?: FirebaseUser | null) => {
    if (!isMountedRef.current) return;

    try {
      console.log("Loading user profile for:", uid);
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!isMountedRef.current) return;

      if (userDoc.exists()) {
        const data = userDoc.data();
        const profileData: UserProfile = {
          uid,
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: data.role as UserRole,
          homeAddress: data.homeAddress,
          hasCompletedOnboarding: data.hasCompletedOnboarding || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };

        if (isMountedRef.current) {
          setUserProfile(profileData);
        }
        console.log("User profile loaded:", data.role);
      } else {
        console.log("User profile not found, creating...");

        // ⚡ CREATE A NEW PROFILE AUTOMATICALLY
        const newProfile = {
          email: firebaseUser?.email || "",
          name: "",
          phone: "",
          role: "employee",
          homeAddress: "",
          hasCompletedOnboarding: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(userRef, newProfile);

        if (!isMountedRef.current) return;

        // Load again after creating
        if (isMountedRef.current) {
          setUserProfile({ uid, ...newProfile });
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      if (isMountedRef.current) {
        setUserProfile(null);
      }
    }
  };

  // ---- Login ----
  const signIn = useCallback(async (email: string, password: string) => {
    console.log("Signing in user:", email);
    if (isMountedRef.current) {
      setLoading(true);
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user; // onAuthStateChanged will load profile
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // ---- Register ----
  const signUp = useCallback(
    async (email: string, password: string, role: UserRole = "employee") => {
      console.log("Signing up user:", email);
      if (isMountedRef.current) {
        setLoading(true);
      }

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
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    []
  );

  // ---- Logout ----
  const signOut = useCallback(async () => {
    try {
      console.log("Signing out user");
      await firebaseSignOut(auth);
      if (isMountedRef.current) {
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }, []);

  // ---- Update User Profile ----
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) throw new Error("No user logged in");
      if (!isMountedRef.current) return;

      console.log("Updating user profile:", updates);

      try {
        await updateDoc(doc(db, "users", user.uid), {
          ...updates,
          updatedAt: new Date(),
        });

        await loadUserProfile(user.uid, user);
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
