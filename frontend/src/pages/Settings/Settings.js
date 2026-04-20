import { useState, useEffect } from "react";
import API from "../../services/api";
import "./settings.css";

const Settings = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [original, setOriginal] = useState({});

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const res = await API.get("/employees");

        if (res.data.length > 0) {
          const emp = res.data[0];

          setUserId(emp._id);

          const first = emp.name?.split(" ")[0] || "";
          const last = emp.name?.split(" ").slice(1).join(" ") || "";
          const email = emp.email || "";
          setUserId(emp._id);
          const initialData = {
            firstName: first,
            lastName: last,
            email: email,
          };

          setForm({
            ...initialData,
            password: "",
            confirmPassword: "",
          });

          setOriginal(initialData);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadEmployee();
  }, []);
  console.log("FORM:", form);
  console.log("ORIGINAL:", original);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {
    if (!userId) {
      alert("No employee found");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = { userId };

    const cleanEmail = form.email.trim().toLowerCase();
    const originalEmail = original.email?.trim().toLowerCase();

    if (form.firstName !== original.firstName) {
      payload.firstName = form.firstName;
    }

    if (form.lastName !== original.lastName) {
      payload.lastName = form.lastName;
    }

    if (cleanEmail !== originalEmail) {
      payload.email = cleanEmail;
    }

    if (form.password) {
      payload.password = form.password;
    }

    console.log("FINAL PAYLOAD:", payload);

    if (Object.keys(payload).length === 1) {
      alert("No changes made");
      return;
    }

    try {
      await API.put("/settings/update", payload);
      alert("Updated successfully");
      window.dispatchEvent(new Event("employeeUpdated"));
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Update failed");
    }
  };
  return (
    <div className="settings-page">
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <div className="breadcrumb-item">
          <span>Home</span>
        </div>
        <span className="arrow">&gt;</span>
        <span className="active">Settings</span>
      </div>

      {/* BOX */}
      <div className="settings-box">
        {/* HEADER */}
        <div className="header-wrapper">
          <span className="title">Edit Profile</span>
          <div className="line">
            <div className="active-line"></div>
          </div>
        </div>

        {/* FORM */}
        <div className="signup-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button className="save-btn" onClick={save}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Settings;
