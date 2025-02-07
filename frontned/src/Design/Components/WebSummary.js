import React, { useState } from "react";

const WebSummary = () => {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setLoading(true);
    setError("");
    setSummary(null);

    try {
      const response = await fetch("http://localhost:3001/webSummary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to summarize the webpage.");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
      <h2>Webpage Summarizer</h2>
      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button
        onClick={handleSummarize}
        disabled={loading}
        style={{ padding: "10px", cursor: "pointer" }}
      >
        {loading ? "Summarizing..." : "Get Summary"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h3>Summary:</h3>
          {/* <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {JSON.stringify(summary, null, 2)}
          </pre> */}
          <p> {JSON.stringify(summary, null, 2)}</p>
        </div>
      )}
    </div>
  );
};

export default WebSummary;
