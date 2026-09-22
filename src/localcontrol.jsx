// src/LocateControl.jsx
import React, { useState } from "react";
import { useMap } from "react-leaflet";

export default function LocateControl({ onLocationFound }) {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };

        // 1. Pan and zoom map to user position
        map.flyTo([latitude, longitude], 16, {
          animate: true,
          duration: 1.5,
        });

        // 2. Pass coordinates up to parent state to drop selected pin
        onLocationFound(coords);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        console.error("Geolocation error:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert(
              "Location access denied. Please enable location permissions.",
            );
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out.");
            break;
          default:
            alert("An unknown error occurred while retrieving location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <button
      type="button"
      onClick={handleLocate}
      disabled={loading}
      style={{
        position: "absolute",
        top: "16px",
        right: "16px",
        zIndex: 1000,
        backgroundColor: "#0f172a",
        color: "#3b82f6",
        border: "1px solid rgba(59, 130, 246, 0.4)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontWeight: 600,
        fontSize: "0.85rem",
        cursor: loading ? "wait" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
      }}
    >
      <span>{loading ? "⏳ Locating..." : "🎯 Use My Location"}</span>
    </button>
  );
}
