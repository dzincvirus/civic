import React from "react";

export default function RecentReports({ issues = [], handleStatusChange }) {
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
    <section style={{ width: "100%", boxSizing: "border-box" }}>
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
              key={issue.id || Math.random()}
              style={{
                backgroundColor: "#0f172a",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  backgroundColor: "#1e293b",
                  overflow: "hidden",
                }}
              >
                {issue.image_url ? (
                  <img
                    src={issue.image_url}
                    alt={issue.title || "Report Image"}
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
                      fontSize: "0.85rem",
                    }}
                  >
                    📷 No Photo Attached
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  flex: 1,
                }}
              >
                {/* Category & Status */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {issue.category || "GENERAL"}
                  </span>

                  {handleStatusChange ? (
                    <select
                      value={issue.status || "unresolved"}
                      onChange={(e) =>
                        handleStatusChange(issue.id, e.target.value)
                      }
                      style={{
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.text,
                        border: `1px solid ${badgeStyle.border}`,
                        borderRadius: "20px",
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      <option
                        value="unresolved"
                        style={{ background: "#0f172a", color: "#f87171" }}
                      >
                        Unresolved
                      </option>
                      <option
                        value="in_progress"
                        style={{ background: "#0f172a", color: "#fbbf24" }}
                      >
                        In Progress
                      </option>
                      <option
                        value="resolved"
                        style={{ background: "#0f172a", color: "#34d399" }}
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
                    lineHeight: "1.4",
                  }}
                >
                  {issue.title || "Untitled Incident"}
                </h4>

                {/* Coordinates */}
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "10px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    fontSize: "0.75rem",
                    color: "#64748b",
                  }}
                >
                  📍 Lat: {Number(issue.latitude || 0).toFixed(4)}, Lng:{" "}
                  {Number(issue.longitude || 0).toFixed(4)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
