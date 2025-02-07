import React, { useState } from "react";

const EditJob = () => {
  const [jobTitle, setJobTitle] = useState(""); // Job to edit
  const [updates, setUpdates] = useState({}); // Updated job details

  // Handle input changes for single-value fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdates({ ...updates, [name]: value });
  };

  // Handle input changes for array fields (comma-separated values)
  const handleArrayChange = (e, field) => {
    setUpdates({ ...updates, [field]: e.target.value.split(",") });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle) {
      alert("Please enter the job title to update!");
      return;
    }

    const response = await fetch("http://localhost:3001/editJob", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, ...updates }),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="container my-4">
      <h2 className="text-warning text-center">Edit Job</h2>
      <form className="card p-3 shadow" onSubmit={handleSubmit}>
        {/* Job title (required to find the job to update) */}
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Enter Job Title to Edit"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />

        {/* Editable fields */}
        <input
          className="form-control mb-2"
          type="text"
          name="jobField"
          placeholder="New Job Field"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="experience"
          placeholder="New Experience"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="companyName"
          placeholder="New Company Name"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="Location"
          placeholder="New Location"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="OnsiteWFHHybrid"
          placeholder="New Work Mode (Onsite/WFH/Hybrid)"
          onChange={handleChange}
        />

        {/* Editable array fields (comma-separated values) */}
        <input
          className="form-control mb-2"
          type="text"
          name="qualification"
          placeholder="New Qualifications (comma separated)"
          onChange={(e) => handleArrayChange(e, "qualification")}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="certifications"
          placeholder="New Certifications (comma separated)"
          onChange={(e) => handleArrayChange(e, "certifications")}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="Technologies"
          placeholder="New Technologies (comma separated)"
          onChange={(e) => handleArrayChange(e, "Technologies")}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="Skills"
          placeholder="New Skills (comma separated)"
          onChange={(e) => handleArrayChange(e, "Skills")}
        />

        {/* Job description and closing date */}
        <textarea
          className="form-control mb-2"
          name="jobDescription"
          placeholder="New Job Description"
          onChange={handleChange}
        ></textarea>
        <input
          className="form-control mb-2"
          type="date"
          name="closingDate"
          onChange={handleChange}
        />

        {/* Submit button */}
        <button className="btn btn-warning">Update Job</button>
      </form>
    </div>
  );
};

export default EditJob;
