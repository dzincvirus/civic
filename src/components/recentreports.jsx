// src/components/RecentReports.jsx
import React, { useState } from "react";

const statusConfig = {
  unresolved: {
    label: "Unresolved",
    bg: "rgba(239, 68, 68, 0.12)",
    color: "#fca5a5",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    dot: "#ef4444",
  },
  in_progress: {
    label: "In Progress",
    bg: "rgba(245, 158, 11, 0.12)",
    color: "#fde68a",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    dot: "#f59e0b",
  },
  resolved: {
    label: "Resolved",
    bg: "rgba(16, 185, 129, 0.12)",
    color: "#6ee7b7",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    dot: "#10b981",
  },
};

const categoryIcons = {
  Garbage: "🗑️",
  Pothole: "🕳️",
  Lighting: "💡",
  Other: "📌",
};

// Format timestamps relative to current time
function formatRelativeTime(dateString) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function RecentReports({ issues = [], handleStatusChange }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", "Garbage", "Pothole", "Lighting", "Other"];

  const filteredIssues =
    filterCategory === "All"
      ? issues
      : issues.filter((i) => i.category === filterCategory);

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Header & Category Filter Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 4px 0",
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#f8fafc",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            📋 Community Reports
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                color: "#60a5fa",
                padding: "2px 8px",
                borderRadius: "12px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              }}
            >
              {filteredIssues.length}
            </span>
          </h2>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>
            Live status of incidents reported across the city
          </p>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                border:
                  filterCategory === cat
                    ? "1px solid #3b82f6"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor:
                  filterCategory === cat
                    ? "rgba(59, 130, 246, 0.2)"
                    : "rgba(255, 255, 255, 0.03)",
                color: filterCategory === cat ? "#60a5fa" : "#94a3b8",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {cat !== "All" && categoryIcons[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Report Cards */}
      {filteredIssues.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#64748b",
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            border: "1px dashed rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🔍</div>
          <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>
            No reports found for this category.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {filteredIssues.map((issue) => {
            const status =
              statusConfig[issue.status] || statusConfig.unresolved;
            const icon = categoryIcons[issue.category] || "📌";

            return (
              <div
                key={issue.id}
                className="report-card hover-glow"
                style={{
                  backgroundColor: "#1e293b",
                  borderRadius: "14px",
                  padding: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "12px",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "default",
                  position: "relative",
                }}
              >
                {/* Top Bar: Icon, Title & Time */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.2rem",
                        padding: "6px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        display: "inline-flex",
                      }}
                    >
                      {icon}
                    </span>

                    {/* Status Badge */}
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "20px",
                        backgroundColor: status.bg,
                        color: status.color,
                        border: status.border,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: status.dot,
                        }}
                      />
                      {status.label}
                    </span>
                  </div>

                  <h4
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#f8fafc",
                      lineHeight: "1.3",
                    }}
                  >
                    {issue.title}
                  </h4>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      fontSize: "0.75rem",
                      color: "#64748b",
                    }}
                  >
                    <span>{issue.category}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(issue.created_at)}</span>
                  </div>
                </div>

                {/* Optional Image Attachment with Click-to-Zoom */}
                {issue.image_url && (
                  <div
                    onClick={() => setSelectedImage(issue.image_url)}
                    style={{
                      borderRadius: "10px",
                      overflow: "hidden",
                      height: "140px",
                      backgroundColor: "#0f172a",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <img
                      src={issue.image_url}
                      alt={issue.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "6px",
                        right: "6px",
                        backgroundColor: "rgba(15, 23, 42, 0.75)",
                        color: "#f8fafc",
                        fontSize: "0.65rem",
                        padding: "3px 7px",
                        borderRadius: "6px",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      🔍 Click to view
                    </div>
                  </div>
                )}

                {/* Coordinates Footnote */}
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#475569",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    paddingTop: "10px",
                    marginTop: "4px",
                  }}
                >
                  <span>
                    📍 {issue.latitude?.toFixed(3)},{" "}
                    {issue.longitude?.toFixed(3)}
                  </span>

                  {/* Admin Direct Action Control */}
                  {handleStatusChange && (
                    <select
                      value={issue.status}
                      onChange={(e) =>
                        handleStatusChange(issue.id, e.target.value)
                      }
                      style={{
                        backgroundColor: "#0f172a",
                        color: "#60a5fa",
                        border: "1px solid rgba(59, 130, 246, 0.4)",
                        borderRadius: "6px",
                        padding: "2px 6px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      <option value="unresolved">Mark Unresolved</option>
                      <option value="in_progress">Mark In Progress</option>
                      <option value="resolved">Mark Resolved</option>
                    </select>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-screen Image Preview Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          >
            <img
              src={selectedImage}
              alt="Report Full Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                borderRadius: "12px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: "-12px",
                right: "-12px",
                backgroundColor: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
