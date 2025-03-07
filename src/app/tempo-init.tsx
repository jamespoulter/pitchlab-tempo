"use client";

// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
import { useEffect } from "react";

export function TempoInit() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_TEMPO === "true") {
      try {
        console.log("Initializing Tempo Devtools");
        TempoDevtools.init();
        console.log("Tempo Devtools initialized successfully");
      } catch (error) {
        console.error("Error initializing Tempo Devtools:", error);
      }
    }
  }, []);

  return null;
}
