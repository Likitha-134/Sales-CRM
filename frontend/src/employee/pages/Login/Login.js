import { useState } from "react";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/employee-login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("employeeEmail", res.data.user.email);
      localStorage.setItem("employeeId", res.data.user._id);

      navigate("/employee/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="employee-login-container">
      <div className="login-box">
        <div className="logo">
          <span className="canova">Canova</span>
          <span className="crm">CRM</span>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-box"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input-box"
        />

        <button className="submit-btn" onClick={handleLogin}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login;
