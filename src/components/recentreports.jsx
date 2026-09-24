import React from "react";

export default function RecentReports({ issues = [], handleStatusChange }) {
  const getBadgeDetails = (status) => {
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
          marginTop: "32px",
          padding: "24px",
          textAlign: "center",
          color: "#94a3b8",
          backgroundColor: "#0f172a",
          borderRadius: "12px",
          border: "1px dashed rgba(255, 255, 255, 0.15)",
        }}
      >
        No reported incidents found.
      </div>
    );
  }

  return (
    <section
      style={{ width: "100%", marginTop: "32px", boxSizing: "border-box" }}
    >
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#f8fafc",
          marginBottom: "20px",
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
        {issues.map((issue, idx) => {
          const badge = getBadgeDetails(issue.status);
          const reportTitle =
            issue.title || issue.description || "Incident Report";
          const reportCategory = issue.category || "General";
          const reportImg = issue.image_url || issue.image || issue.photo;
          const lat = issue.latitude
            ? Number(issue.latitude).toFixed(4)
            : "N/A";
          const lng = issue.longitude
            ? Number(issue.longitude).toFixed(4)
            : "N/A";

          return (
            <div
              key={issue.id || idx}
              style={{
                backgroundColor: "#0f172a",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
              }}
            >
              {/* Image Header */}
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  backgroundColor: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {reportImg ? (
                  <img
                    src={reportImg}
                    alt={reportTitle}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    📷 No Photo Uploaded
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  flex: 1,
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
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {reportCategory}
                  </span>

                  {handleStatusChange ? (
                    <select
                      value={issue.status || "unresolved"}
                      onChange={(e) =>
                        handleStatusChange(issue.id, e.target.value)
                      }
                      style={{
                        backgroundColor: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
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
                        backgroundColor: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {badge.label}
                    </span>
                  )}
                </div>

                <h4
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#f8fafc",
                    lineHeight: "1.4",
                  }}
                >
                  {reportTitle}
                </h4>

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "10px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    fontSize: "0.75rem",
                    color: "#64748b",
                  }}
                >
                  📍 Lat: {lat}, Lng: {lng}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
