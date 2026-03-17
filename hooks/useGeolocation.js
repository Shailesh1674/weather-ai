"use client";

import { useState, useEffect, useCallback } from "react";

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Default fallback
    const fallback = { lat: 19.0760, lon: 72.8777, name: "Mumbai" };

    if (typeof window === "undefined") {
      setLocation(fallback);
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Showing Mumbai.");
      setLocation(fallback);
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      // If geolocation prompt hangs for 10s, fallback
      if (loading) {
        setError("Geolocation timed out. Showing default city.");
        setLocation(fallback);
        setLoading(false);
      }
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        clearTimeout(timeoutId);
        setError("Location denied. Showing Mumbai.");
        setLocation(fallback);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );

    return () => clearTimeout(timeoutId);
  }, []);

  return { location, error, loading };
}
