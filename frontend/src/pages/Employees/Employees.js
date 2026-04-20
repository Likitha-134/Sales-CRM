import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import "./employees.css";

const role = localStorage.getItem("role");
const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const [employeeForm, setEmployeeForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    language: "",
  });
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / itemsPerPage),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      setSelected(paginatedEmployees.map((emp) => emp._id));
    } else {
      setSelected([]);
    }
  };
  useEffect(() => {
    const fetchEmployees = () => {
      API.get("/employees")
        .then((res) => setEmployees(res.data))
        .catch((err) => console.log(err));
    };

    fetchEmployees();

    window.addEventListener("employeeUpdated", fetchEmployees);

    return () => {
      window.removeEventListener("employeeUpdated", fetchEmployees);
    };
  }, []);
  useEffect(() => {
    setFilteredEmployees(employees);

    const handler = (e) => {
      const q = e.detail.toLowerCase();

      const filtered = employees.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(q) ||
          emp.email?.toLowerCase().includes(q) ||
          emp.employeeId?.toLowerCase().includes(q),
      );

      setFilteredEmployees(filtered);
      setCurrentPage(1);
    };

    window.addEventListener("globalSearch", handler);

    return () => window.removeEventListener("globalSearch", handler);
  }, [employees]);

  useEffect(() => {
    const close = () => setActiveMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);
  useEffect(() => {
    const allIds = paginatedEmployees.map((emp) => emp._id);

    const allSelected =
      allIds.length > 0 && allIds.every((id) => selected.includes(id));

    setSelectAll(allSelected);
  }, [paginatedEmployees, selected]);
  const saveEmployee = async () => {
    try {
      const payload = {
        name: employeeForm.firstName + " " + employeeForm.lastName,
        email: employeeForm.email,
        location: employeeForm.location,
        language: employeeForm.language,
      };

      await API.post("/employees", payload);

      const res = await API.get("/employees");
      setEmployees(res.data);

      setShowModal(false);
    } catch (err) {
      console.log(err);
      alert("Error saving employee");
    }
  };

  const openSettings = (emp) => {
    localStorage.setItem("selectedEmployeeId", emp._id);
    navigate("/settings");
  };
  return (
    <div className="employees-container">
      {/* HEADER */}
      <div className="employees-header">
        <div className="breadcrumb">
          <span>Home</span>
          <span className="arrow"> &gt; </span>
          <span className="active">Employees</span>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          Add Employees
        </button>
      </div>

      {/* TABLE */}
      <div className="employee-table">
        {/* HEADER */}
        <div className="table-head">
          <div className="col checkbox">
            <input
              type="checkbox"
              checked={
                paginatedEmployees.length > 0 &&
                paginatedEmployees.every((emp) => selected.includes(emp._id))
              }
              ref={(el) => {
                if (!el) return;

                const allSelected =
                  paginatedEmployees.length > 0 &&
                  paginatedEmployees.every((emp) => selected.includes(emp._id));

                const someSelected = paginatedEmployees.some((emp) =>
                  selected.includes(emp._id),
                );

                el.indeterminate = !allSelected && someSelected;
              }}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelected((prev) => [
                    ...new Set([
                      ...prev,
                      ...paginatedEmployees.map((emp) => emp._id),
                    ]),
                  ]);
                } else {
                  const ids = paginatedEmployees.map((emp) => emp._id);
                  setSelected((prev) => prev.filter((id) => !ids.includes(id)));
                }
              }}
            />
          </div>
          <div className="col name">Name</div>
          <div className="col empid">Employee ID</div>
          <div className="col assigned">Assigned Leads</div>
          <div className="col closed">Closed Leads</div>
          <div className="col status">Status</div>
          <div className="col actions"></div>
        </div>

        {/* BODY */}
        <div className="table-body">
          {paginatedEmployees.map((emp) => (
            <div
              key={emp._id}
              className={`table-row ${selected.includes(emp._id) ? "selected" : ""}`}
            >
              <div className="col checkbox">
                <input
                  type="checkbox"
                  checked={selected.includes(emp._id)}
                  onChange={() => {
                    setSelected((prev) =>
                      prev.includes(emp._id)
                        ? prev.filter((id) => id !== emp._id)
                        : [...prev, emp._id],
                    );
                  }}
                />
              </div>
              <div className="col name">{emp.name}</div>

              <div className="col empid">
                <span className="id-pill">#{emp._id}</span>
              </div>

              <div className="col assigned">{emp.assignedLeads ?? 0}</div>
              <div className="col closed">{emp.closedLeads ?? 0}</div>

              <div className="col status">
                <div
                  className={`status-pill ${emp.assignedLeads > 0 ? "status-active" : "status-inactive"}`}
                >
                  <span className="status-dot"></span>
                  {emp.assignedLeads > 0 ? "Active" : "Inactive"}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="col actions">
                <div className="action-wrapper">
                  <div
                    className="dots"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(emp._id === activeMenu ? null : emp._id);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="black"
                    >
                      <circle cx="8" cy="2" r="1.5" />
                      <circle cx="8" cy="8" r="1.5" />
                      <circle cx="8" cy="14" r="1.5" />
                    </svg>
                  </div>
                  {activeMenu === emp._id && (
                    <div className="dropdown">
                      <div
                        className="dropdown-item"
                        onClick={() => openSettings(emp)}
                      >
                        <div className="icon-box">✏️</div>
                        Edit
                      </div>

                      <div className="dropdown-item delete">
                        <div className="icon-box">🗑️</div>
                        <span className="delete-text">Delete</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* PAGINATION */}
        {totalPages > 0 && (
          <div className="pagination">
            <button
              className="nav-btn"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              ← Previous
            </button>

            <div className="pages">
              {Array.from({ length: totalPages }, (_, i) => (
                <div
                  key={i}
                  className={`page ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </div>
              ))}
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
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {/* HEADER */}
            <div className="modal-header">
              <h2>Add New Employee</h2>
              {role === "admin" && (
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => setShowModal(true)}
                >
                  Add Employees
                </button>
              )}
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            {/* FORM */}
            <div className="modal-form">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={employeeForm.firstName}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={employeeForm.lastName}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) =>
                    setEmployeeForm({ ...employeeForm, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={employeeForm.location}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Preferred Language</label>
                <input
                  type="text"
                  value={employeeForm.language}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      language: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            {/* FOOTER */}
            <div className="modal-footer">
              <button type="button" className="save-btn" onClick={saveEmployee}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
