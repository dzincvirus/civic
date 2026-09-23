// src/About.jsx
import React from "react";

export default function About({ onClose }) {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "24px",
        backgroundColor: "#0f172a",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        color: "#f1f5f9",
      }}
    >
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#3b82f6",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "0.9rem",
          padding: 0,
          marginBottom: "16px",
        }}
      >
        ← Back to Live Map
      </button>

      <h1
        style={{ fontSize: "1.75rem", margin: "0 0 12px 0", color: "#f8fafc" }}
      >
        About CivicPulse
      </h1>
      <p style={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: "1.6" }}>
        CivicPulse is a community incident tracker designed to connect citizens
        with city services to report, track, and resolve non-emergency
        neighborhood issues.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "16px",
            borderRadius: "10px",
          }}
        >
          <h3
            style={{ margin: "0 0 6px 0", color: "#60a5fa", fontSize: "1rem" }}
          >
            📍 1. Pin
          </h3>
          <p style={{ margin: 0, fontSize: "0.825rem", color: "#94a3b8" }}>
            Select the exact location of the issue on the live interactive map.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "16px",
            borderRadius: "10px",
          }}
        >
          <h3
            style={{ margin: "0 0 6px 0", color: "#f59e0b", fontSize: "1rem" }}
          >
            📷 2. Report
          </h3>
          <p style={{ margin: 0, fontSize: "0.825rem", color: "#94a3b8" }}>
            Attach a photo, select a category, and submit the incident report.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "16px",
            borderRadius: "10px",
          }}
        >
          <h3
            style={{ margin: "0 0 6px 0", color: "#10b981", fontSize: "1rem" }}
          >
            ✅ 3. Resolve
          </h3>
          <p style={{ margin: 0, fontSize: "0.825rem", color: "#94a3b8" }}>
            City admins update status markers live as repairs take place.
          </p>
        </div>
      </div>
    </div>
  );
}
