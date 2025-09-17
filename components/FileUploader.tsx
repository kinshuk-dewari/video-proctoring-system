"use client";

import { useState } from "react";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    setUploading(true);

    const formData = new FormData();
    formData.append("video", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResponse(data);
    setUploading(false);
  };

  return (
    <div className="p-4 border rounded">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {response && (
        <div className="mt-3 text-sm text-green-600">
          ✅ Uploaded: {response.filename} <br />
          File ID: {response.fileId}
        </div>
      )}
    </div>
  );
}
