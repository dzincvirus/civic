// src/About.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "0 20px",
        color: "#f1f5f9",
      }}
    >
      <Link
        to="/"
        style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}
      >
        ← Back to Live Map
      </Link>

      <h1 style={{ fontSize: "2rem", marginTop: "20px", color: "#f8fafc" }}>
        About CivicPulse
      </h1>
      <p style={{ fontSize: "1.05rem", color: "#94a3b8", lineHeight: "1.6" }}>
        CivicPulse is a crowdsourced civic engagement platform designed to
        empower residents to report non-emergency neighborhood issues directly
        to local authorities.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          margin: "32px 0",
        }}
      >
        <div
          style={{
            backgroundColor: "#0f172a",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#60a5fa" }}>📍 1. Pin</h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
            Select the exact location of the issue on our live interactive map.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#0f172a",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#f59e0b" }}>
            📷 2. Report
          </h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
            Attach a photo, choose a category, and submit the incident report.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#0f172a",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#10b981" }}>
            ✅ 3. Resolve
          </h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
            City admins update status markers live as repairs take place.
          </p>
        </div>
      </div>
    </div>
  );
}
