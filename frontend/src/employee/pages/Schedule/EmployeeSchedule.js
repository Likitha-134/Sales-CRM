import { useEffect, useState } from "react";
import {
  FaHome,
  FaUser,
  FaFilter,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./employeeschedule.css";

const Schedule = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("employeeId");

  const [search, setSearch] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState("Today");
  const [filterPos, setFilterPos] = useState({ x: 0, y: 0 });

  const fetchSchedules = async () => {
    try {
      const res = await API.get(`/leads?assignedTo=${userId}`);
      const scheduledOnly = res.data.filter(
        (lead) =>
          lead.scheduledDate !== null && lead.scheduledDate !== undefined,
      );
      setSchedules(scheduledOnly);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedules();
    setFilterType("All");
  }, []);

  const today = new Date().toDateString();
  const filtered = schedules.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase());

    const hasValidDate =
      item.scheduledDate && !isNaN(new Date(item.scheduledDate));

    const itemDate = hasValidDate
      ? new Date(item.scheduledDate).toDateString()
      : null;

    const today = new Date().toDateString();

    if (filterType === "Today") {
      return matchesSearch && itemDate === today;
    }

    return matchesSearch;
  });

  return (
    <div className="schedule-page">
      <div className="top-bar">
        <div className="logo">
          <span className="canova">Canova</span>
          <span className="crm">CRM</span>
        </div>

        <div className="schedule-title">
          <span className="back" onClick={() => navigate(-1)}>
            &lt;
          </span>
          <h2>Schedule</h2>
        </div>
      </div>

      <div className="search-row" style={{ position: "relative" }}>
        <input
          className="search-input"
          placeholder="Search schedule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div
          className="filter-box"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setFilterPos({ x: rect.left, y: rect.top - 10 });
            setShowFilter(true);
          }}
        >
          <FaFilter />
        </div>
        {showFilter && (
          <div className="filter-popup" onClick={() => setShowFilter(false)}>
            <div
              className="filter-box-main"
              style={{
                position: "absolute",
                top: filterPos.y,
                left: filterPos.x,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="filter-title">Filter</div>

              <select
                className="filter-dropdown"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="Today">Today</option>
                <option value="All">All</option>
              </select>

              <button
                className="filter-save"
                onClick={() => setShowFilter(false)}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="schedule-list">
        {filtered.map((item) => (
          <div className="schedule-card" key={item._id}>
            <div className="source-badge">{item.source}</div>

            <div className="right-date">
              <div className="date-title">Date</div>
              <div className="date-value">
                {item.scheduledDate
                  ? new Date(item.scheduledDate).toLocaleDateString()
                  : "Not scheduled"}
              </div>
            </div>

            <div className="name-row">
              <img
                src={`https://i.pravatar.cc/150?img=${item._id?.slice(-2) || 10}`}
                className="avatar"
              />
              <div className="name-text">{item.name}</div>
            </div>

            <div className="bottom-row">
              <div className="location">
                <FaMapMarkerAlt />
                {item.location}
              </div>

              <div className="call">
                <FaPhoneAlt />
                Call
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-nav">
        <div
          className="nav-item"
          onClick={() => navigate("/employee/dashboard")}
        >
          <FaHome />
          <span>Home</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/employee/leads")}>
          <MdOutlineLeaderboard />
          <span>Leads</span>
        </div>

        <div className="nav-item active">
          <AiOutlineCalendar />
          <span>Schedule</span>
        </div>

        <div className="nav-item">
          <FaUser />
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
