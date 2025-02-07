import React, { useState, useEffect } from "react";

const ApplyJob = ({ job, onClose }) => {
  const [applicantName, setApplicantName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/applyJob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job.id,
        applicantName: "Test User",
        email: "test@example.com",
        resumeLink: "https://resume.example.com",
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("API Response:", data))
      .catch((error) => console.error("Error:", error));
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/applyJob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job.id,
        applicantName,
        email,
        resumeLink,
      }),
    });

    const data = await response.json();
    alert(data.message);
    setApplicantName("");
    setEmail("");
    setResumeLink("");
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Apply for {job.jobTitle}</h5>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-2"
                type="text"
                placeholder="Your Name"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
              />
              <input
                className="form-control mb-2"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="form-control mb-2"
                type="text"
                placeholder="Resume Link (Google Drive, LinkedIn, etc.)"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                required
              />
              <button className="btn btn-success w-100">
                Submit Application
              </button>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
