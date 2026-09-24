// src/components/recentreports.jsx
import React, { useState } from "react";

export default function RecentReports({ issues = [], handleStatusChange }) {
  const [hoveredIssue, setHoveredIssue] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  const getStatusBadgeStyle = (status) => {
    const norm = (status || "").toLowerCase();
    if (norm === "resolved" || norm === "fixed") {
      return {
        bg: "rgba(16, 185, 129, 0.2)",
        text: "#34d399",
        border: "#10b981",
        label: "Resolved",
      };
    }
    if (norm === "in_progress" || norm === "in progress") {
      return {
        bg: "rgba(245, 158, 11, 0.2)",
        text: "#fbbf24",
        border: "#f59e0b",
        label: "In Progress",
      };
    }
    return {
      bg: "rgba(239, 68, 68, 0.2)",
      text: "#f87171",
      border: "#ef4444",
      label: "Unresolved",
    };
  };

  const handleMouseMove = (e) => {
    const x = Math.min(e.clientX + 15, window.innerWidth - 320);
    const y = Math.min(e.clientY + 15, window.innerHeight - 260);
    setPopupPos({ x, y });
  };

  if (!issues || issues.length === 0) {
    return (
      <section style={{ marginTop: "36px", padding: "0 12px" }}>
        <div
          style={{
            backgroundColor: "#0f172a",
            borderRadius: "16px",
            padding: "32px",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#94a3b8",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            No reports submitted yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginTop: "36px", padding: "0 12px" }}>
      <h3
        style={{
          fontSize: "1.35rem",
          fontWeight: 700,
          color: "#f8fafc",
          marginBottom: "24px",
          textAlign: "center",
          letterSpacing: "-0.01em",
        }}
      >
        Recent Reports ({issues.length})
      </h3>

      {/* Responsive Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {issues.map((issue) => {
          const badgeStyle = getStatusBadgeStyle(issue.status);
          const isHovered = hoveredIssue?.id === issue.id;

          return (
            <div
              key={`${issue.id}-${issue.status}`}
              onMouseEnter={(e) => {
                setHoveredIssue(issue);
                handleMouseMove(e);
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredIssue(null)}
              style={{
                backgroundColor: "#1e293b",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                position: "relative",
                transition:
                  "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                transform: isHovered ? "translateY(-6px) scale(1.02)" : "none",
                boxShadow: isHovered
                  ? "0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.3)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                borderColor: isHovered
                  ? "rgba(59, 130, 246, 0.5)"
                  : "rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* Image Container */}
              <div
                style={{
                  width: "100%",
                  height: "160px",
                  backgroundColor: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  position: "relative",
                }}
              >
                {issue.image_url ? (
                  <img
                    src={issue.image_url}
                    alt={issue.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      color: "#64748b",
                      fontSize: "0.8rem",
                    }}
                  >
                    <span style={{ fontSize: "1.6rem" }}>📷</span>
                    <span>No Photo Uploaded</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    {issue.category || "General"}
                  </span>

                  {/* Admin Status Dropdown vs Public Badge */}
                  {handleStatusChange ? (
                    <select
                      value={issue.status || "unresolved"}
                      onChange={(e) =>
                        handleStatusChange(issue.id, e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "8px",
                        fontSize: "0.725rem",
                        fontWeight: 600,
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.text,
                        border: `1px solid ${badgeStyle.border}`,
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      <option
                        value="unresolved"
                        style={{ background: "#0f172a", color: "#fff" }}
                      >
                        Unresolved
                      </option>
                      <option
                        value="in_progress"
                        style={{ background: "#0f172a", color: "#fff" }}
                      >
                        In Progress
                      </option>
                      <option
                        value="resolved"
                        style={{ background: "#0f172a", color: "#fff" }}
                      >
                        Resolved
                      </option>
                    </select>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.725rem",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "20px",
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.text,
                        border: `1px solid ${badgeStyle.border}`,
                      }}
                    >
                      {badgeStyle.label}
                    </span>
                  )}
                </div>

                <h4
                  style={{
                    margin: 0,
                    fontSize: "0.975rem",
                    fontWeight: 600,
                    color: "#f8fafc",
                    lineHeight: "1.35",
                  }}
                >
                  {issue.title}
                </h4>

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "10px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.75rem",
                    color: "#64748b",
                  }}
                >
                  <span>📍</span>
                  <span>
                    Lat: {Number(issue.latitude).toFixed(4)}, Lng:{" "}
                    {Number(issue.longitude).toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Hover Window */}
      {hoveredIssue && (
        <div
          style={{
            position: "fixed",
            left: `${popupPos.x}px`,
            top: `${popupPos.y}px`,
            width: "290px",
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            borderRadius: "12px",
            padding: "14px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#3b82f6",
                textTransform: "uppercase",
              }}
            >
              Quick Preview
            </span>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
              ID: #{hoveredIssue.id}
            </span>
          </div>

          <h5
            style={{
              margin: "0 0 8px 0",
              color: "#f8fafc",
              fontSize: "0.95rem",
              fontWeight: 600,
            }}
          >
            {hoveredIssue.title}
          </h5>

          {hoveredIssue.description && (
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "0.8rem",
                color: "#cbd5e1",
                lineHeight: "1.4",
                maxHeight: "60px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {hoveredIssue.description}
            </p>
          )}

          <div
            style={{
              fontSize: "0.775rem",
              color: "#94a3b8",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {hoveredIssue.reporter_name && (
              <div>
                👤 <strong style={{ color: "#e2e8f0" }}>Reporter:</strong>{" "}
                {hoveredIssue.reporter_name}
              </div>
            )}
            {hoveredIssue.phone && (
              <div>
                📞 <strong style={{ color: "#e2e8f0" }}>Phone:</strong>{" "}
                {hoveredIssue.phone}
              </div>
            )}
            <div>
              🕒 <strong style={{ color: "#e2e8f0" }}>Reported:</strong>{" "}
              {hoveredIssue.created_at
                ? new Date(hoveredIssue.created_at).toLocaleDateString()
                : "Recently"}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
