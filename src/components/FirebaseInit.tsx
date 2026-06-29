"use client";

import { useEffect, useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";

export function FirebaseInit() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isFirebaseConfigured) {
      console.log("🔥 Firebase connected — using Firestore live data");
    } else {
      console.log("📦 Firebase not configured — using mock seed data");
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div id="fb-status" className="hidden" data-configured={isFirebaseConfigured} />
  );
}
