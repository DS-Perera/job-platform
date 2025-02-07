import React, { useState } from "react";

const AddJob = () => {
  const [job, setJob] = useState({
    jobTitle: "",
    jobField: "",
    qualification: [],
    experience: "",
    certifications: [],
    companyName: "",
    Location: "",
    OnsiteWFHHybrid: "",
    Technologies: [],
    Skills: [],
    jobDescription: "",
    closingDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleArrayChange = (e, field) => {
    setJob({ ...job, [field]: e.target.value.split(",") });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/addJob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="container my-4">
      <h2 className="text-primary">Add Job</h2>
      <form className="card p-3 shadow" onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="text"
          name="jobTitle"
          placeholder="Job Title"
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          name="jobField"
          placeholder="Job Field"
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          name="qualification"
          placeholder="Qualifications (comma separated)"
          onChange={(e) => handleArrayChange(e, "qualification")}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="experience"
          placeholder="Experience"
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          name="certifications"
          placeholder="Certifications (comma separated)"
          onChange={(e) => handleArrayChange(e, "certifications")}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          name="Location"
          placeholder="Location"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="OnsiteWFHHybrid"
          placeholder="Onsite/WFH/Hybrid"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="Technologies"
          placeholder="Technologies (comma separated)"
          onChange={(e) => handleArrayChange(e, "Technologies")}
        />
        <input
          className="form-control mb-2"
          type="text"
          name="Skills"
          placeholder="Skills (comma separated)"
          onChange={(e) => handleArrayChange(e, "Skills")}
        />
        <textarea
          className="form-control mb-2"
          name="jobDescription"
          placeholder="Job Description"
          onChange={handleChange}
          required
        ></textarea>
        <input
          className="form-control mb-2"
          type="date"
          name="closingDate"
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary">Add Job</button>
      </form>
    </div>
  );
};

export default AddJob;
