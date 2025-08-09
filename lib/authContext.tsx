// lib/authContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authen, db } from "../config/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// User profile (not including password)
interface User {
  email: string;
  fullName: string;
  phoneNumber: string;
  credential: FirebaseUser;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string
  ) => Promise<{ success: boolean; msg?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Persist user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authen, async (firebaseUser) => {
      if (firebaseUser) {
        // Load user profile from Firestore
        const docRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(docRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const userObj: User = {
            email: userData.email,
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            credential: userData.credential,
          };
          setUser(userObj);
          await AsyncStorage.setItem("user", JSON.stringify(userObj));
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(authen, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(authen, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        fullName,
        phoneNumber,
        createdAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const logout = async () => {
    await authen.signOut();
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
