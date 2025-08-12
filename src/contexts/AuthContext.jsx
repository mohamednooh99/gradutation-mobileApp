import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../services/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Set current user
      setCurrentUser(user);

      // If user is logged in, fetch their data from Firestore
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error getting user Firestore data:", error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In function
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // Check if user exists in Firestore, if not create a new user document
      const userDocRef = doc(db, "users", result.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Create new user document for Google sign-in
        await setDoc(userDocRef, {
          name: result.user.displayName,
          email: result.user.email,
          phone: result.user.phoneNumber || "",
          nationalId: "",
          role: "user", // Default role for new users
          createdAt: new Date(),
          uid: result.user.uid,
        });
      }

      return result;
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  // Email/Password Sign-In function
  const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error("Error signing in with email", error);
      throw error;
    }
  };

  // Email/Password Sign-Up function
  const signUpWithEmail = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document in Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, {
        ...userData,
        role: "user", // Default role for new users
        createdAt: new Date(),
        uid: userCredential.user.uid,
      });

      return userCredential;
    } catch (error) {
      console.error("Error creating user with email", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
