import React, { useState } from "react";

const Summary = () => {
  const [jsonData, setJsonData] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSummary("");

    try {
      let parsedJson;

      // Try parsing the JSON and catch any errors if the input is invalid
      try {
        parsedJson = JSON.parse(jsonData);
      } catch (parseError) {
        setError("Invalid JSON format. Please check your input.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedJson),
      });

      if (!response.ok) {
        throw new Error("Server error. Please try again later.");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err.message || "An error occurred.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>JSON Summarizer</h2>
      <textarea
        rows="10"
        cols="50"
        placeholder="Paste JSON here..."
        value={jsonData}
        onChange={(e) => setJsonData(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />
      <br />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ padding: "10px 20px", marginTop: "10px" }}
      >
        {loading ? "Summarizing..." : "Summarize JSON"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {summary && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            background: "#f9f9f9",
          }}
        >
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default Summary;
