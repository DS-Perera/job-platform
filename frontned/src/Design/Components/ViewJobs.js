import React, { useEffect, useState } from "react";
import ApplyJob from "./ApplyJob";

const ViewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/viewJob")
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditJob({ ...editJob, [name]: value });
  };

  const handleArrayChange = (e, field) => {
    setEditJob({ ...editJob, [field]: e.target.value.split(",") });
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/editJob", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editJob),
    });
    const data = await response.json();
    alert(data.message);
    setEditJob(null);
  };

  return (
    <div className="container my-4">
      <h2 className="text-success text-center">All Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-center">No jobs available.</p>
      ) : (
        <div className="row">
          {jobs.map((job, index) => (
            <div key={index} className="col-md-4">
              <div className="card p-3 mb-3 shadow">
                <h4 className="text-primary">{job.jobTitle}</h4>
                <p>
                  <strong>Company:</strong> {job.companyName}
                </p>
                <p>
                  <strong>Field:</strong> {job.jobField}
                </p>
                <p>
                  <strong>Location:</strong> {job.Location} (
                  {job.OnsiteWFHHybrid})
                </p>
                <p>
                  <strong>Experience:</strong> {job.experience}
                </p>
                <button
                  className="btn btn-info me-2"
                  onClick={() => setSelectedJob(job)}
                >
                  View Details
                </button>
                <button
                  className="btn btn-success w-100 mt-2"
                  onClick={() => setApplyJob(job)}
                >
                  Apply Now
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => setEditJob(job)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      {selectedJob && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedJob.jobTitle} at {selectedJob.companyName}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setSelectedJob(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Field:</strong> {selectedJob.jobField}
                </p>
                <p>
                  <strong>Location:</strong> {selectedJob.Location} (
                  {selectedJob.OnsiteWFHHybrid})
                </p>
                <p>
                  <strong>Experience:</strong> {selectedJob.experience}
                </p>
                <p>
                  <strong>Closing Date:</strong> {selectedJob.closingDate}
                </p>
                <p>
                  <strong>Qualifications:</strong>{" "}
                  {selectedJob.qualification.join(", ")}
                </p>
                <p>
                  <strong>Certifications:</strong>{" "}
                  {selectedJob.certifications.join(", ")}
                </p>
                <p>
                  <strong>Technologies:</strong>{" "}
                  {selectedJob.Technologies.join(", ")}
                </p>
                <p>
                  <strong>Skills:</strong> {selectedJob.Skills.join(", ")}
                </p>
                <p>
                  <strong>Description:</strong> {selectedJob.jobDescription}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedJob(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {applyJob && (
        <ApplyJob job={applyJob} onClose={() => setApplyJob(null)} />
      )}
      {editJob && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit {editJob.jobTitle}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setEditJob(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateJob}>
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="jobTitle"
                    value={editJob.jobTitle}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="jobField"
                    value={editJob.jobField}
                    onChange={handleEditChange}
                  />
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="experience"
                    value={editJob.experience}
                    onChange={handleEditChange}
                  />
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="companyName"
                    value={editJob.companyName}
                    onChange={handleEditChange}
                  />
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="Location"
                    value={editJob.Location}
                    onChange={handleEditChange}
                  />
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="OnsiteWFHHybrid"
                    value={editJob.OnsiteWFHHybrid}
                    onChange={handleEditChange}
                  />
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="qualification"
                    value={editJob.qualification.join(",")}
                    onChange={(e) => handleArrayChange(e, "qualification")}
                  />
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="certifications"
                    value={editJob.certifications.join(",")}
                    onChange={(e) => handleArrayChange(e, "certifications")}
                  />
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="Technologies"
                    value={editJob.Technologies.join(",")}
                    onChange={(e) => handleArrayChange(e, "Technologies")}
                  />
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="Skills"
                    value={editJob.Skills.join(",")}
                    onChange={(e) => handleArrayChange(e, "Skills")}
                  />
                  <textarea
                    className="form-control mb-2"
                    name="jobDescription"
                    value={editJob.jobDescription}
                    onChange={handleEditChange}
                  ></textarea>
                  <input
                    className="form-control mb-2"
                    type="date"
                    name="closingDate"
                    value={editJob.closingDate}
                    onChange={handleEditChange}
                  />
                  <button className="btn btn-warning">Update Job</button>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditJob(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewJobs;
