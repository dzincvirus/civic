// src/Footer.jsx
import React from "react";

export default function Footer({ onOpenAbout }) {
  return (
    <footer
      style={{
        marginTop: "60px",
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
          gap: "20px",
          marginBottom: "12px",
        }}
      >
        <button
          onClick={onOpenAbout}
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          About Us
        </button>
        <span>•</span>
        <a href="#privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>
          Privacy Policy
        </a>
        <span>•</span>
        <a href="#terms" style={{ color: "#94a3b8", textDecoration: "none" }}>
          Terms of Service
        </a>
      </div>
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} CivicPulse Community Incident Tracker. All
        rights reserved.
      </p>
    </footer>
  );
}
