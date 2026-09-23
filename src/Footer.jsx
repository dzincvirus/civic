// src/Footer.jsx
import React from "react";

export default function Footer({ onOpenAbout }) {
  return (
    <footer
      style={{
        marginTop: "40px",
        padding: "24px 20px",
        backgroundColor: "#0f172a",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        textAlign: "center",
        fontSize: "0.85rem",
        color: "#64748b",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onOpenAbout}
          style={{
            background: "none",
            border: "none",
            color: "#3b82f6",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            padding: 0,
            textDecoration: "underline",
          }}
        >
          About CivicPulse
        </button>
        <span>•</span>
        <span style={{ color: "#64748b" }}>Live Incident Tracker</span>
        <span>•</span>
        <span style={{ color: "#64748b" }}>Community Driven</span>
      </div>
      <p style={{ margin: 0, fontSize: "0.75rem", color: "#475569" }}>
        © {new Date().getFullYear()} CivicPulse. Empowering local communities.
      </p>
    </footer>
  );
}
