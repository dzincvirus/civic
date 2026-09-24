import React, { useRef, useState, useEffect } from "react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let activeStream = null;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Default to rear camera on mobile
          audio: false,
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Unable to access camera. Please check browser permissions.");
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera_capture_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          const previewUrl = URL.createObjectURL(blob);
          onCapture(file, previewUrl);
        }
      }, "image/jpeg");

      stopCamera();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (onClose) onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "#0f172a",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "14px",
            color: "#f8fafc",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          📸 Take Photo
        </div>

        {error ? (
          <div
            style={{
              padding: "20px",
              color: "#f87171",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              maxHeight: "380px",
              objectFit: "cover",
              backgroundColor: "#000",
            }}
          />
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div style={{ display: "flex", gap: "10px", padding: "14px" }}>
          <button
            type="button"
            onClick={stopCamera}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backgroundColor: "transparent",
              color: "#94a3b8",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          {!error && (
            <button
              type="button"
              onClick={capturePhoto}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Capture
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
