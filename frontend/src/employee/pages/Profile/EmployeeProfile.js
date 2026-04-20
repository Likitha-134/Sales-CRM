import { useEffect, useState } from "react";
import { FaHome, FaUser } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./employeeprofile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem("employeeId");

      const res = await API.get(`/employees/${userId}`);

      if (!res.data) return;

      const fullName = res.data.name || "";
      const [firstName = "", lastName = ""] = fullName.split(" ");

      setForm({
        firstName,
        lastName,
        email: res.data.email || "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("employeeId");

      if (form.password && form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await API.put(`/employees/${userId}`, payload);

      alert("Profile Updated");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/employee/login");
  };

  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="top-bar">
        <div className="logo">
          <span className="canova">Canova</span>
          <span className="crm">CRM</span>
        </div>

        <div className="schedule-title">
          <span className="back" onClick={() => navigate(-1)}>
            &lt;
          </span>
          <h2>Profile</h2>
        </div>
      </div>

      {/* FORM */}
      <div className="profile-form">
        <div className="form-group">
          <label>First name</label>
          <input
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="input-box"
          />
        </div>
        <div className="form-group">
          <label>Last name</label>
          <input
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="input-box"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-box"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-box"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            className="input-box"
          />
        </div>

        {/* BUTTONS */}
        <div className="btn-row">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
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

        <div className="nav-item active">
          <FaUser />
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
