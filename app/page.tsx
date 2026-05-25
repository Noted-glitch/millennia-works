"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [message, setMessage] = useState<string>("Loading from Firebase...");

  useEffect(() => {
    async function fetchTestMessage() {
      try {
        const querySnapshot = await getDocs(collection(db, "test"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.message) {
            setMessage(data.message);
          }
        });
      } catch (error) {
        console.error("Firebase error:", error);
        setMessage("Failed to connect to Firebase. Check console.");
      }
    }

    fetchTestMessage();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1A1A2E",
        color: "#FAFAF7",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#D4AF37", marginBottom: "1rem" }}>
        Millennia Works
      </h1>
      <p style={{ fontSize: "1.25rem", color: "#E8E0D0", marginBottom: "2rem" }}>
        From Idea To Empire
      </p>
      <div
        style={{
          padding: "1rem 2rem",
          border: "1px solid #D4AF37",
          borderRadius: "8px",
          backgroundColor: "rgba(212, 175, 55, 0.1)",
        }}
      >
        <p style={{ fontSize: "1rem" }}>{message}</p>
      </div>
    </main>
  );
}