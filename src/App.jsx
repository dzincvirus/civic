// src/App.jsx
import RecentReports from "./components/recentreports";
import "./index.css";
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "./supabaseClient";
import IssuesList from "./Issueslist";
import About from "./About";
import Footer from "./Footer";
// High-DPI SVG Pin Creator for status pins
const createCustomIcon = (color) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="38" height="38" style="filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.25)); transition: transform 0.2s ease;">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5-2.5 2.5z"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "custom-leaflet-pin",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
};

const statusColors = {
  unresolved: "#ef4444",
  in_progress: "#f59e0b",
  resolved: "#10b981",
};

// Component to register clicks on the map
function MapClickHandler({ onSelectLocation }) {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng);
    },
  });
  return null;
}

// Locate User Control Component
function LocateControl({ onSelectLocation }) {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latlng = { lat: latitude, lng: longitude };

        map.flyTo([latitude, longitude], 15, { animate: true });

        if (onSelectLocation) {
          onSelectLocation(latlng);
        }
      },
      (error) => {
        alert("Unable to retrieve location: " + error.message);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <button
      type="button"
      onClick={handleLocate}
      title="Use My Location"
      style={{
        position: "absolute",
        bottom: "16px",
        right: "12px",
        zIndex: 1000,
        backgroundColor: "#1e293b",
        color: "#3b82f6",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "24px",
        padding: "10px 16px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "0.85rem",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      🎯 Use My Location
    </button>
  );
}

export default function App() {
  const [issues, setIssues] = useState([]);
  const [session, setSession] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Garbage");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Mobile View Switcher: 'map' or 'form'
  const [activeTab, setActiveTab] = useState("map");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Admin Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  const defaultCenter = [25.5788, 91.8933];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const loadIssues = async () => {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setIssues(data);
      if (error) console.error("Error fetching issues:", error.message);
    };
    loadIssues();

    const channel = supabase
      .channel("public:issues")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "issues" },
        (payload) => {
          setIssues((prev) => {
            if (prev.some((item) => item.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "issues" },
        (payload) => {
          setIssues((prev) =>
            prev.map((item) =>
              item.id === payload.new.id ? payload.new : item,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "issues" },
        (payload) => {
          setIssues((prev) =>
            prev.filter((item) => item.id !== payload.old.id),
          );
        },
      )
      .subscribe();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (authSubscription) authSubscription.unsubscribe(); // Safe unsubscribe check
      supabase.removeChannel(channel);
    };
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthenticating(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    setAuthenticating(false);

    if (error) {
      setAuthError(error.message);
    } else {
      const role = data.user?.user_metadata?.role;
      if (role !== "admin") {
        setAuthError("Access denied: Account does not have admin privileges.");
        await supabase.auth.signOut();
      } else {
        setIsLoginOpen(false);
        setAdminEmail("");
        setAdminPassword("");
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCoords || !title) {
      alert("Please select a location on the map first!");
      if (isMobile) setActiveTab("map");
      return;
    }

    setSubmitting(true);
    let imageUrl = null;

    try {
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("issue_img")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("issue_img")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const { data: insertedData, error: insertError } = await supabase
        .from("issues")
        .insert([
          {
            title,
            category,
            latitude: selectedCoords.lat,
            longitude: selectedCoords.lng,
            image_url: imageUrl,
            status: "unresolved",
          },
        ])
        .select();

      if (insertError) throw insertError;

      if (insertedData && insertedData.length > 0) {
        setIssues((prev) => [insertedData[0], ...prev]);
      }

      setTitle("");
      handleRemoveFile();
      setSelectedCoords(null);
      alert("Report submitted successfully!");
      if (isMobile) setActiveTab("map");
    } catch (err) {
      console.error("Submission failed:", err.message);
      alert(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const isAdmin = session?.user?.user_metadata?.role === "admin";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#090d16",
        color: "#f1f5f9",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        paddingBottom: "80px",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: isMobile ? "12px 16px" : "16px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: isMobile ? "36px" : "40px",
              height: isMobile ? "36px" : "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "1rem" : "1.2rem",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
            }}
          >
            📡
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? "1.1rem" : "1.25rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                background: "linear-gradient(to right, #ffffff, #94a3b8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CivicPulse
            </h1>
            {!isMobile && (
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                Community Incident Tracker
              </p>
            )}
          </div>
        </div>

        <div>
          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: isAdmin ? "#10b981" : "#94a3b8",
                  backgroundColor: isAdmin
                    ? "rgba(16, 185, 129, 0.12)"
                    : "rgba(255, 255, 255, 0.05)",
                  padding: "6px 10px",
                  borderRadius: "20px",
                  border: isAdmin
                    ? "1px solid rgba(16, 185, 129, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {isAdmin ? "👑 Admin" : "👤 User"}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#e2e8f0",
                  minHeight: "36px",
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthError("");
                setIsLoginOpen(true);
              }}
              style={{
                padding: "8px 14px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                minHeight: "36px",
              }}
            >
              Admin Access
            </button>
          )}
        </div>
      </header>

      {/* Mobile-Friendly Toggle Tabs */}
      {isMobile && (
        <div
          style={{
            display: "flex",
            margin: "16px 16px 0 16px",
            padding: "4px",
            backgroundColor: "#0f172a",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("map")}
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "0.85rem",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "map" ? "#1e293b" : "transparent",
              color: activeTab === "map" ? "#60a5fa" : "#64748b",
              transition: "all 0.2s ease",
            }}
          >
            📍 Live Map
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "0.85rem",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "form" ? "#1e293b" : "transparent",
              color: activeTab === "form" ? "#60a5fa" : "#64748b",
              transition: "all 0.2s ease",
            }}
          >
            📝 Report Issue {selectedCoords ? "•" : ""}
          </button>
        </div>
      )}

      {/* Main Container */}
      <main
        style={{
          maxWidth: "1180px",
          margin: isMobile ? "16px auto 0 auto" : "32px auto 0 auto",
          padding: isMobile ? "0 12px" : "0 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* Left Panel: Map */}
          {(!isMobile || activeTab === "map") && (
            <div
              style={{
                backgroundColor: "#0f172a",
                borderRadius: "16px",
                padding: isMobile ? "14px" : "20px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#f8fafc",
                  }}
                >
                  📍 Realtime Live Map
                </h3>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      color: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#ef4444",
                      }}
                    ></span>{" "}
                    Unresolved
                  </span>
                  <span
                    style={{
                      color: "#f59e0b",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#f59e0b",
                      }}
                    ></span>{" "}
                    In Progress
                  </span>
                  <span
                    style={{
                      color: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#10b981",
                      }}
                    ></span>{" "}
                    Resolved
                  </span>
                </div>
              </div>

              <div
                style={{
                  height: isMobile ? "380px" : "480px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  position: "relative",
                }}
              >
                <MapContainer
                  center={defaultCenter}
                  zoom={13}
                  zoomControl={false}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapClickHandler onSelectLocation={setSelectedCoords} />
                  <LocateControl onSelectLocation={setSelectedCoords} />

                  {issues.map((issue) => (
                    <Marker
                      key={`${issue.id}-${issue.status}`}
                      position={[issue.latitude, issue.longitude]}
                      icon={createCustomIcon(
                        statusColors[issue.status] || "#ef4444",
                      )}
                    >
                      <Popup>
                        <div style={{ maxWidth: "200px", padding: "4px" }}>
                          <h4
                            style={{
                              margin: "0 0 6px 0",
                              color: "#0f172a",
                              fontSize: "0.95rem",
                            }}
                          >
                            {issue.title}
                          </h4>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#475569",
                              marginBottom: "8px",
                            }}
                          >
                            <div>
                              <strong>Category:</strong> {issue.category}
                            </div>
                            <div>
                              <strong>Status:</strong> {issue.status}
                            </div>
                          </div>
                          {issue.image_url && (
                            <img
                              src={issue.image_url}
                              alt={issue.title}
                              style={{
                                width: "100%",
                                height: "110px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {selectedCoords && (
                    <Marker
                      position={selectedCoords}
                      icon={createCustomIcon("#3b82f6")}
                    >
                      <Popup>Selected Pin Location</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              <RecentReports issues={issues} />

              {isMobile && selectedCoords && (
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Continue with Selected Location ➔
                </button>
              )}
            </div>
          )}

          {/* Right Panel: Incident Form */}
          {(!isMobile || activeTab === "form") && (
            <div
              style={{
                backgroundColor: "#0f172a",
                borderRadius: "16px",
                padding: isMobile ? "18px" : "24px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#f8fafc",
                }}
              >
                📝 Submit Incident Report
              </h3>
              <p
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                }}
              >
                Pin a spot on the map and attach details below.
              </p>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    1. Pin Location
                  </label>
                  <div
                    onClick={() => isMobile && setActiveTab("map")}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: selectedCoords
                        ? "rgba(59, 130, 246, 0.12)"
                        : "rgba(255, 255, 255, 0.03)",
                      border: selectedCoords
                        ? "1px solid #3b82f6"
                        : "1px dashed rgba(255, 255, 255, 0.18)",
                      fontSize: "0.85rem",
                      color: selectedCoords ? "#60a5fa" : "#94a3b8",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    {selectedCoords
                      ? `📍 ${selectedCoords.lat.toFixed(4)}, ${selectedCoords.lng.toFixed(4)}`
                      : "Tap here to choose location on map"}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    2. Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "#1e293b",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "#f8fafc",
                      fontSize: "0.9rem",
                      outline: "none",
                      minHeight: "44px",
                    }}
                  >
                    <option value="Garbage">Garbage / Unlawful Dumping</option>
                    <option value="Pothole">Pothole / Road Damage</option>
                    <option value="Lighting">Broken Streetlight</option>
                    <option value="Other">Other Community Issue</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    3. Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Overflowing dumpsters near main street"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "#1e293b",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "#f8fafc",
                      fontSize: "0.9rem",
                      outline: "none",
                      boxSizing: "border-box",
                      minHeight: "44px",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    4. Photo Attachment
                  </label>

                  {!previewUrl ? (
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "18px 14px",
                        borderRadius: "10px",
                        backgroundColor: "#1e293b",
                        border: "2px dashed rgba(255, 255, 255, 0.15)",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(59, 130, 246, 0.15)",
                          color: "#60a5fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "6px",
                          fontSize: "1.1rem",
                        }}
                      >
                        📷
                      </div>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#e2e8f0",
                        }}
                      >
                        Upload Photo Evidence
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </label>
                  ) : (
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        backgroundColor: "#1e293b",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="Upload Preview"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.825rem",
                            fontWeight: 600,
                            color: "#f8fafc",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file?.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: "rgba(239, 68, 68, 0.15)",
                          color: "#fca5a5",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    marginTop: "6px",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                    opacity: submitting ? 0.7 : 1,
                    minHeight: "48px",
                  }}
                >
                  {submitting ? "Publishing..." : "Submit Incident Report"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Community Feed / Admin Section */}
        <section style={{ marginTop: isMobile ? "24px" : "40px" }}>
          <IssuesList issues={issues} setIssues={setIssues} session={session} />
        </section>
      </main>

      <Footer onOpenAbout={() => setIsAboutOpen(true)} />

      {isAboutOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <About onClose={() => setIsAboutOpen(false)} />
        </div>
      )}

      {/* Admin Authentication Modal */}
      {isLoginOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(10, 15, 26, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: isMobile ? "flex-end" : "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#0f172a",
              borderRadius: isMobile ? "20px 20px 0 0" : "16px",
              width: "100%",
              maxWidth: isMobile ? "100%" : "380px",
              padding: isMobile ? "24px 20px 36px 20px" : "32px 28px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h3
                style={{
                  margin: "0 0 4px 0",
                  color: "#f8fafc",
                  fontSize: "1.15rem",
                }}
              >
                Admin Access
              </h3>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.8rem" }}>
                Sign in to manage reported civic issues
              </p>
            </div>

            {authError && (
              <div
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#fca5a5",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  marginBottom: "14px",
                  textAlign: "center",
                }}
              >
                {authError}
              </div>
            )}

            <form
              onSubmit={handleAdminLoginSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                    marginBottom: "6px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@civicpulse.org"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#f8fafc",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                    marginBottom: "6px",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#f8fafc",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    backgroundColor: "transparent",
                    color: "#94a3b8",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authenticating}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: authenticating ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  {authenticating ? "Auth..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
