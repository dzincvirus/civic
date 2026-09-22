// src/IssuesList.jsx
import React from "react";
import { supabase } from "./supabaseClient";

export default function IssuesList({ issues = [], setIssues, session }) {
  // Check if current logged-in user is an admin
  const isAdmin = session?.user?.user_metadata?.role === "admin";

  // Function to update status in Supabase Database
  const handleStatusChange = async (issueId, newStatus) => {
    if (!isAdmin) {
      alert("Unauthorized: Only administrators can update issue statuses.");
      return;
    }

    try {
      const { error } = await supabase
        .from("issues")
        .update({ status: newStatus })
        .eq("id", issueId);

      if (error) throw error;

      // Update local state so UI updates immediately
      if (setIssues) {
        setIssues((prevIssues) =>
          prevIssues.map((item) =>
            item.id === issueId ? { ...item, status: newStatus } : item,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err.message);
      alert(`Could not update status: ${err.message}`);
    }
  };

  if (!issues.length) {
    return (
      <div
        className="card"
        style={{ textAlign: "center", color: "var(--text-muted)" }}
      >
        No reported issues yet. Be the first to report!
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h3
        style={{
          margin: "0 0 8px 0",
          fontSize: "1.1rem",
          color: "var(--text-main)",
        }}
      >
        Recent Reports ({issues.length})
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="card"
            style={{ padding: "0", overflow: "hidden" }}
          >
            {issue.image_url ? (
              <img
                src={issue.image_url}
                alt={issue.title}
                style={{ width: "100%", height: "160px", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  height: "100px",
                  background: "var(--bg-main)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                No photo provided
              </div>
            )}

            <div style={{ padding: "16px" }}>
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
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  {issue.category}
                </span>

                {/* Show Dropdown ONLY to Admins, else show static badge */}
                {isAdmin ? (
                  <select
                    value={issue.status || "unresolved"}
                    onChange={(e) =>
                      handleStatusChange(issue.id, e.target.value)
                    }
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    <option value="unresolved">🔴 Unresolved</option>
                    <option value="in_progress">🟠 In Progress</option>
                    <option value="resolved">🟢 Resolved</option>
                  </select>
                ) : (
                  <span
                    className={`badge badge-${issue.status || "unresolved"}`}
                  >
                    {issue.status || "unresolved"}
                  </span>
                )}
              </div>

              <h4
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "1rem",
                  color: "var(--text-main)",
                }}
              >
                {issue.title}
              </h4>

              {issue.description && (
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "0.875rem",
                    color: "var(--text-muted)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {issue.description}
                </p>
              )}

              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                📍 Lat:{" "}
                {issue.latitude != null ? issue.latitude.toFixed(4) : "N/A"},
                Lng:{" "}
                {issue.longitude != null ? issue.longitude.toFixed(4) : "N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
