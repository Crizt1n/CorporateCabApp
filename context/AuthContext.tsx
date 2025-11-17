import createContextHook from "@nkzw/create-context-hook";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect, useCallback, useMemo } from "react";
import { auth, db } from "@/config/firebase";
import { UserProfile, UserRole } from "@/types";

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setInitializing(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          uid,
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: (data.role as UserRole) || "employee",
          homeAddress: data.homeAddress,
          hasCompletedOnboarding: data.hasCompletedOnboarding || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      } else {
        const newProfile: Omit<UserProfile, "uid"> = {
          email: auth.currentUser?.email || "",
          name: "",
          phone: "",
          role: "employee",
          homeAddress: "",
          hasCompletedOnboarding: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(userRef, newProfile);
        setUserProfile({ uid, ...newProfile });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUserProfile(null);
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, role: UserRole = "employee") => {
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
      } catch (error) {
        console.error("Sign up error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) throw new Error("No user logged in");
      setLoading(true);
      try {
        await updateDoc(doc(db, "users", user.uid), {
          ...updates,
          updatedAt: new Date(),
        });
        await loadUserProfile(user.uid);
      } catch (error) {
        console.error("Update profile error:", error);
        throw error;
      } finally {
        setLoading(false);
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
    [user, userProfile, loading, initializing, signIn, signUp, signOut, updateProfile]
  );
});
