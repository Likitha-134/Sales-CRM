import { useEffect, useState } from "react";
import { FaHome, FaUser } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import { BsClock } from "react-icons/bs";
import { IoCheckmarkDone } from "react-icons/io5";
import API from "../../../services/api";
import "./employeeleads.css";

const Leads = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("employeeId");

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [popupType, setPopupType] = useState(null);

  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [editType, setEditType] = useState("");
  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
  });
  const [statusValue, setStatusValue] = useState("Ongoing");

  const fetchLeads = async () => {
    try {
      const res = await API.get(`/leads?assignedTo=${userId}`);
      setLeads([...res.data]);
    } catch (err) {
      console.error("Lead fetch error:", err);
    }
  };
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()),
  );
  const handleSave = async () => {
    if (!selectedLead) return;

    try {
      if (popupType === "edit") {
        if (!editType) return;

        await API.put(`/leads/${selectedLead._id}`, {
          type: editType,
        });
      }

      if (popupType === "schedule") {
        if (!scheduleData.date) return;

        await API.put(`/leads/schedule/${selectedLead._id}`, {
          scheduledDate: scheduleData.date,
          scheduleTime: scheduleData.time,
        });
      }

      if (popupType === "status") {
        setLeads((prev) =>
          prev.map((l) =>
            l._id === selectedLead._id ? { ...l, status: statusValue } : l,
          ),
        );

        if (statusValue === "Closed") {
          await API.put(`/leads/close/${selectedLead._id}`);
        } else {
          // if reopening or ongoing → you NEED backend route (optional fix below)
          await API.put(`/leads/status/${selectedLead._id}`, {
            status: statusValue,
          });
        }
      }

      await fetchLeads();

      setSelectedLead(null);
      setPopupType(null);

      setEditType("");
      setScheduleData({ date: "", time: "" });
      setStatusValue("Ongoing");
    } catch (err) {
      console.error(err);
    }
  };
  const handleType = async (type) => {
    try {
      await API.put(`/leads/${selectedLead._id}`, { type });

      fetchLeads();
      setSelectedLead(null);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="leads-page">
      {/* HEADER */}
      <div className="top-bar">
        <div className="logo">
          <span className="canova">Canova</span>
          <span className="crm">CRM</span>
        </div>

        <div className="leads-title">
          <span className="back">&lt;</span>
          <h2>Leads</h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LEADS LIST */}
      <div className="leads-list">
        {filteredLeads.map((lead, i) => {
          const isClosed = lead.status === "Closed";

          const colors = ["#F77307", "#3B82F6", "#22C55E", "#A855F7"];
          const color = colors[i % colors.length];

          return (
            <div className={`lead-card ${isClosed ? "disabled" : ""}`} key={i}>
              {/* LEFT STATUS LINE */}
              <div className="status-line" style={{ background: color }} />

              <div className="lead-content">
                {/* LEFT INFO */}
                <div className="lead-left">
                  <div className="lead-name">{lead.name}</div>

                  <div className="lead-email">{lead.email}</div>

                  {/* DATE ROW (calendar + date) */}
                  <div className="lead-date-row">
                    <AiOutlineCalendar className="cal-icon" />
                    <span>{new Date(lead.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="lead-right">
                  {/* PROGRESS CIRCLE */}
                  <div
                    className={`progress-ring ${isClosed ? "closed" : ""}`}
                    style={{ borderColor: color }}
                  >
                    <span>{isClosed ? "Closed" : "Ongoing"}</span>
                  </div>

                  <div className="icon-row">
                    <FiEdit3
                      onClick={(e) => {
                        setSelectedLead(lead);
                        setPopupType("edit");

                        const rect = e.currentTarget.getBoundingClientRect();

                        setPopupPos({
                          x: rect.right + 8,
                          y: rect.top,
                        });
                      }}
                    />
                    <BsClock
                      onClick={(e) => {
                        setSelectedLead(lead);
                        setPopupType("schedule");

                        const rect = e.currentTarget.getBoundingClientRect();

                        setPopupPos({
                          x: rect.right + 8,
                          y: rect.top,
                        });
                      }}
                    />
                    <IoCheckmarkDone
                      onClick={(e) => {
                        setSelectedLead(lead);
                        setPopupType("status");

                        const rect = e.currentTarget.getBoundingClientRect();

                        setPopupPos({
                          x: rect.right + 8,
                          y: rect.top,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <div
          className="nav-item"
          onClick={() => navigate("/employee/dashboard")}
        >
          <FaHome />
          <span>Home</span>
        </div>

        <div className="nav-item active">
          <MdOutlineLeaderboard />
          <span>Leads</span>
        </div>

        <div
          className="nav-item"
          onClick={() => navigate("/employee/schedule")}
        >
          <AiOutlineCalendar />
          <span>Schedule</span>
        </div>

        <div className="nav-item">
          <FaUser />
          <span>Profile</span>
        </div>
      </div>
      {selectedLead && (
        <div className="popup-overlay" onClick={() => setSelectedLead(null)}>
          {popupType === "edit" && (
            <div
              className="popup edit-popup"
              style={{ top: popupPos.y, left: popupPos.x }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-type-title">Type</div>
              <div className="popup-row hot" onClick={() => handleType("Hot")}>
                Hot
              </div>

              <div
                className="popup-row warm"
                onClick={() => handleType("Warm")}
              >
                Warm
              </div>

              <div
                className="popup-row cold"
                onClick={() => handleType("Cold")}
              >
                Cold
              </div>
            </div>
          )}

          {popupType === "schedule" && (
            <div
              className="popup schedule-popup"
              style={{ top: popupPos.y, left: popupPos.x }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-title">Schedule Meeting</div>

              <input
                type="date"
                className="popup-input"
                value={scheduleData.date}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, date: e.target.value })
                }
              />

              <textarea
                placeholder="Time"
                className="popup-textarea"
                value={scheduleData.time}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, time: e.target.value })
                }
              />

              <button className="popup-save" onClick={handleSave}>
                Save
              </button>
            </div>
          )}

          {popupType === "status" && (
            <div
              className="popup status-popup"
              style={{
                top: popupPos.y,
                left: popupPos.x,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-title">Lead Status</div>

              <select
                className="popup-input"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Closed">Closed</option>
              </select>

              <button className="popup-save" onClick={handleSave}>
                Save
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leads;
