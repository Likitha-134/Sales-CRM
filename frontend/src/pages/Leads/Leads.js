import { useEffect, useState } from "react";
import API from "../../services/api";
import "./leads.css";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [showManual, setShowManual] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReadyToUpload, setIsReadyToUpload] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;
  const [form, setForm] = useState({
    name: "",
    email: "",
    source: "",
    date: "",
    location: "",
    language: "",
  });

  // FETCH DATA
  useEffect(() => {
    API.get("/leads")
      .then((res) => setLeads(res.data))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    setFilteredLeads(leads);

    const handler = (e) => {
      const q = e.detail.toLowerCase();

      const filtered = leads.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(q) ||
          lead.email?.toLowerCase().includes(q) ||
          lead.source?.toLowerCase().includes(q),
      );

      setFilteredLeads(filtered);
      setCurrentPage(1);
    };

    window.addEventListener("globalSearch", handler);

    return () => window.removeEventListener("globalSearch", handler);
  }, [leads]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / itemsPerPage),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedLeads = filteredLeads.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // CSV UPLOAD
  const uploadCSV = async (file) => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/leads/upload", formData);

      alert("CSV Uploaded");

      setShowCSV(false);
      setFile(null);
      setIsVerifying(false);
      setProgress(0);
      setIsReadyToUpload(false);

      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // MANUAL ADD
  const addManual = async () => {
    try {
      await API.post("/leads/manual", form);

      alert("Lead Added");
      setShowManual(false);

      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  return (
    <div className="leads-container">
      {/* HEADER */}
      <div className="leads-header">
        <div className="breadcrumb">
          <span className="inactive">Home</span>
          <span className="arrow"> &gt; </span>
          <span className="active">Leads</span>
        </div>

        <div className="btn-group">
          <button onClick={() => setShowManual(true)}>Add Manually</button>
          <button onClick={() => setShowCSV(true)}>Add CSV</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <div className="table-header">
          <span>No</span>
          <span>Name</span>
          <span>Email</span>
          <span>Source</span>
          <span>Date</span>
          <span>Location</span>
          <span>Language</span>
          <span>Assigned To</span>
          <span>Status</span>
          <span>Type</span>
          <span>Scheduled Date</span>
        </div>

        <div className="divider"></div>

        <div className="table-body">
          {paginatedLeads.map((lead, i) => {
            console.log("scheduledDate:", lead.scheduledDate);

            return (
              <div className="row" key={lead._id}>
                <span>{startIndex + i + 1}</span>

                <span>{lead.name}</span>
                <span>{lead.email}</span>
                <span>{lead.source}</span>

                <span>
                  {lead.date
                    ? new Date(lead.date).toLocaleDateString("en-CA")
                    : ""}
                </span>

                <span>{lead.location}</span>
                <span>{lead.language}</span>

                <span>
                  {lead.assignedTo
                    ? typeof lead.assignedTo === "object"
                      ? lead.assignedTo._id.slice(0, 8)
                      : lead.assignedTo.slice(0, 8)
                    : "-"}
                </span>

                <span>{lead.status}</span>

                <span>Warm</span>

                <span>
                  {lead.scheduledDate
                    ? new Date(lead.scheduledDate).toLocaleDateString("en-CA")
                    : "-"}
                </span>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="nav-btn"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              ← Previous
            </button>

            <div className="pages">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;

                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <div
                      key={page}
                      className={`page ${currentPage === page ? "active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </div>
                  );
                }

                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="dots">
                      ...
                    </span>
                  );
                }

                return null;
              })}
            </div>

            <button
              className="nav-btn"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* CSV MODAL */}
      {showCSV && (
        <div className="modal-overlay">
          <div className="csv-box">
            {/* HEADER */}
            <div className="csv-header">
              <h3>CSV Upload</h3>
              <span className="close" onClick={() => setShowCSV(false)}>
                ✕
              </span>
            </div>

            <p className="csv-subtitle">Add your documents here</p>

            {/* UPLOAD AREA */}
            <div className="upload-area">
              {!isVerifying ? (
                <>
                  <div className="upload-icon">📤</div>

                  <p className="drag-text">
                    Drag your file(s) to start uploading
                  </p>

                  <div className="divider">
                    <div className="line"></div>
                    <span className="or-text">OR</span>
                    <div className="line"></div>
                  </div>

                  <input
                    type="file"
                    id="csvInput"
                    className="hidden-input"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      setFile(selectedFile);
                    }}
                  />

                  <button
                    className="browse-btn"
                    onClick={() => document.getElementById("csvInput").click()}
                  >
                    Browse files
                  </button>

                  {file && (
                    <div className="file-box">
                      <span className="file-name">{file.name}</span>
                      <span className="download-icon">⬇</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="progress-circle">{progress}%</div>

                  <p className="verifying-text">Verifying file...</p>
                  <button
                    className="verify-cancel-btn"
                    onClick={() => {
                      setIsVerifying(false);
                      setProgress(0);
                      setFile(null);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="csv-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowCSV(false);
                  setFile(null);
                  setIsVerifying(false);
                  setProgress(0);
                  setIsReadyToUpload(false);
                }}
              >
                Cancel
              </button>

              <button
                className="next-btn"
                onClick={() => {
                  if (!file) return alert("Select file");

                  if (!isVerifying && !isReadyToUpload) {
                    setIsVerifying(true);

                    let p = 0;
                    const interval = setInterval(() => {
                      p += 10;
                      setProgress(p);

                      if (p >= 100) {
                        clearInterval(interval);
                        setIsVerifying(false);
                        setIsReadyToUpload(true);
                      }
                    }, 200);
                  } else if (isReadyToUpload) {
                    uploadCSV(file);
                  }
                }}
              >
                {isReadyToUpload ? "Upload" : "Next"} <span>›</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MANUAL ADD MODAL */}

      {showManual && (
        <div className="modal">
          <div className="manual-box">
            {/* HEADER */}
            <div className="modal-header">
              <h3>Add Lead Manually</h3>
              <span className="close" onClick={() => setShowManual(false)}>
                ✕
              </span>
            </div>

            <div className="modal-body">
              <div className="field">
                <label>Name</label>
                <input
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Source</label>
                <input
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Location</label>
                <input
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Language</label>
                <input
                  onChange={(e) =>
                    setForm({ ...form, language: e.target.value })
                  }
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="save-btn" onClick={addManual}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
