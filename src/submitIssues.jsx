import React, { useState } from "react";
import { supabase } from "./supabaseClient"; // Path to your Supabase client

export default function SubmitIssueForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = null;

      // 1. Upload image if a file was selected
      if (file) {
        // Generate a unique filename using timestamp and original name
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload file to the 'issue-images' bucket
        const { error: uploadError } = await supabase.storage
          .from("issue-images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from("issue-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // 2. Insert the issue record into the database table
      const { data, error: insertError } = await supabase
        .from("issues")
        .insert([
          {
            title: title,
            description: description,
            image_url: imageUrl,
            status: "pending",
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      alert("Issue submitted successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error("Error submitting issue:", error.message);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h3>Report an Issue</h3>

      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <label>
        Attach Photo:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Submit Issue"}
      </button>
    </form>
  );
}
