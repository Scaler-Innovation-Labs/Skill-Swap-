"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; // Use initialized auth instance

/**
 * TokenLogger listens for Firebase auth state and prints the user's ID token
 * to the browser console each time it changes. Intended for development/debug.
 */
export function TokenLogger() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(/* forceRefresh */ true);
          // eslint-disable-next-line no-console
          console.log("🔥 Firebase ID token:", token);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Failed to obtain ID token", err);
        }
      } else {
        // eslint-disable-next-line no-console
        console.log("🛑 No Firebase user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Component renders nothing.
  return null;
} 