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
      <div
        style={{
          marginTop: "36px",
          padding: "0 12px",
          textAlign: "center",
          color: "#94a3b8",
        }}
      >
        No reports submitted yet.
      </div>
    );
  }

  return (
    <section
      style={{
        marginTop: "36px",
        padding: "0 12px",
        width: "100%",
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      <h3
        style={{
          fontSize: "1.35rem",
          fontWeight: 700,
          color: "#f8fafc",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Recent Reports ({issues.length})
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
          width: "100%",
        }}
      >
        {issues.map((issue) => {
          const badgeStyle = getStatusBadgeStyle(issue.status);

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
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              {/* Image Container */}
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  backgroundColor: "#0f172a",
                  overflow: "hidden",
                  display: "block",
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
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#64748b",
                      fontSize: "0.8rem",
                    }}
                  >
                    No Photo Uploaded
                  </div>
                )}
              </div>

              {/* Card Content Body */}
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  backgroundColor: "#1e293b",
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    {issue.category || "General"}
                  </span>

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
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.text,
                        border: `1px solid ${badgeStyle.border}`,
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
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "4px 10px",
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

                {/* Title */}
                <h4
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#f8fafc",
                    textAlign: "left",
                  }}
                >
                  {issue.title}
                </h4>

                {/* Location Footer */}
                <div
                  style={{
                    paddingTop: "10px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    fontSize: "0.75rem",
                    color: "#64748b",
                    textAlign: "left",
                  }}
                >
                  📍 Lat: {Number(issue.latitude).toFixed(4)}, Lng:{" "}
                  {Number(issue.longitude).toFixed(4)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
