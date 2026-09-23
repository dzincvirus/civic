// src/About.jsx
import React from "react";

export default function About({ onClose }) {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "28px",
        backgroundColor: "#0f172a",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#f1f5f9",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", margin: 0, color: "#f8fafc" }}>
          About CivicPulse
        </h1>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            color: "#94a3b8",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1.1rem",
            padding: "4px 12px",
          }}
        >
          ✕
        </button>
      </div>

      <p style={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: "1.6" }}>
        CivicPulse is a crowdsourced civic engagement platform designed to
        connect community members directly with city services to report, track,
        and resolve local infrastructure issues like potholes, streetlights, and
        trash.
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
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h3
            style={{ margin: "0 0 6px 0", color: "#60a5fa", fontSize: "1rem" }}
          >
            📍 1. Pin
          </h3>
          <p style={{ margin: 0, fontSize: "0.825rem", color: "#94a3b8" }}>
            Select the exact location of the issue on our live interactive map.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "16px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h3
            style={{ margin: "0 0 6px 0", color: "#f59e0b", fontSize: "1rem" }}
          >
            📷 2. Report
          </h3>
          <p style={{ margin: 0, fontSize: "0.825rem", color: "#94a3b8" }}>
            Attach a photo, choose a category, and submit the incident report.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "16px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h3
            style={{ margin: "0 0 6px 0", color: "#10b981", fontSize: "1rem" }}
          >
            ✅ 3. Resolve
          </h3>
          <p style={{ margin: 0, fontSize: "0.825rem", color: "#94a3b8" }}>
            City administrators update status markers live as repairs take
            place.
          </p>
        </div>
      </div>
    </div>
  );
}
