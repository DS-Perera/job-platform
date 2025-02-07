import React, { useState } from "react";

const UploadCV = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Handle file change
  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file upload
  const onFileUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("cvFile", file);

    try {
      const response = await fetch("http://localhost:3001/uploadCV", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.error || "Please try again"}`);
        console.error("Upload Error:", errorData); // Log full error details to console
        return;
      }

      const data = await response.json();
      setUploadStatus("File uploaded successfully!");
      //setCvSummary(data.summary); // Set the summary received from the backend
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="upload-cv-container">
      <h2>Upload Your CV</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload CV</button>

      <div className="upload-status">{uploadStatus}</div>
    </div>
  );
};

export default UploadCV;
