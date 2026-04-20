import { useEffect, useState } from "react";
import { FaHome, FaUser } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./dashboard.css";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const email = localStorage.getItem("employeeEmail");

  const [data, setData] = useState(null);

  const [checkIn, setCheckIn] = useState("--:--");
  const [checkOut, setCheckOut] = useState("--:--");
  const [breaks, setBreaks] = useState([]);
  const [isWorking, setIsWorking] = useState(false);

  const [activities, setActivities] = useState([]);
  const [today, setToday] = useState(new Date().toDateString());
  const fetchEmployee = async () => {
    const res = await API.get(`/employees?email=${email}`);
    const emp = res.data;

    if (!emp) return;

    setData(emp);
    setCheckIn(emp.checkInTime || "--:--");
    setCheckOut(emp.checkOutTime || "--:--");
    setBreaks((emp.breaks || []).slice().reverse());
    setIsWorking(emp.isWorking || false);

    fetchActivities(emp._id);
  };
  const fetchActivities = async (id) => {
    try {
      const res = await API.get(`/activity/${id}`);
      setActivities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toDateString();

      if (now !== today) {
        setCheckIn("--:--");
        setCheckOut("--:--");
        setBreaks([]);
        setIsWorking(false);

        setToday(now);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [today]);

  const handleToggle = async () => {
    const now = new Date();
    const time = now.toLocaleTimeString();

    if (!isWorking && checkIn === "--:--") {
      setCheckIn(time);
      setIsWorking(true);

      await API.post("/attendance/checkin", { email, time });
      fetchEmployee();
    } else if (isWorking && checkOut === "--:--") {
      setCheckOut(time);
      setIsWorking(false);

      await API.post("/attendance/checkout", { email, time });
    }
  };

  const takeBreak = async () => {
    const now = new Date();
    const time = now.toLocaleTimeString();

    try {
      await API.post("/attendance/break", { email, time });
      await fetchEmployee(); // IMPORTANT
    } catch (err) {
      alert(err.response?.data?.message || "Error taking break");
    }
  };

  return (
    <div className="employee-dashboard">
      <div className="top-bar">
        <div className="logo">
          <span className="canova">Canova</span>
          <span className="crm">CRM</span>
        </div>

        <div className="greeting">
          <p>Good Morning</p>
          <h2>{data?.name}</h2>
        </div>
      </div>
      <div className="section-title">Timings</div>

      <div className="time-wrapper">
        <div className="time-box">
          <div className="time-col">
            <span>Check In</span>
            <span>{checkIn}</span>
          </div>

          <div className="time-col">
            <span>Check Out</span>
            <span>{checkOut}</span>
          </div>

          <button
            className={`toggle ${
              isWorking ? "active" : checkOut !== "--:--" ? "red" : ""
            }`}
            onClick={handleToggle}
          />
        </div>
        <div className="time-box break-box-2">
          <div className="time-col">
            <span>Break</span>
            <span>{breaks[0]?.start || "--:--"}</span>
          </div>

          <div className="time-col">
            <span>Ended</span>
            <span>{breaks[0]?.end || "--:--"}</span>
          </div>
          <button
            className={`toggle ${
              breaks.length > 0 && !breaks[0].end
                ? "active"
                : breaks.length > 0 && breaks[0].end
                  ? "red"
                  : ""
            }`}
            onClick={takeBreak}
          />
        </div>
      </div>

      <div className="break-card">
        {/* HEADER */}
        <div className="break-header-row">
          <span>Break</span>
          <span>Ended</span>
          <span>Date</span>
        </div>

        <div className="break-list">
          {breaks.slice(0, 4).map((b, i) => (
            <div className="break-row" key={i}>
              <span>{b.start}</span>
              <span>{b.end || "--:--"}</span>
              <span>{b.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="activity-section">
        <div className="activity-title">Recent Activity</div>

        <div className="activity-card">
          <div className="scroll">
            {activities.slice(0, 10).map((a, i) => (
              <div className="activity-item" key={i}>
                {a.message}
                <span className="activity-date">{a.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="nav-item active">
          <FaHome />
          <span>Home</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/employee/leads")}>
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

        <div className="nav-item" onClick={() => navigate("/employee/profile")}>
          <FaUser />
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
