import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import EmployeeDashboard from "../pages/Dashboard/EmployeeDashboard";
import EmployeeLead from "../pages/Leads/EmployeeLead";
import EmployeeSchedule from "../pages/Schedule/EmployeeSchedule";
import EmployeeProfile from "../pages/Profile/EmployeeProfile";
const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="login" />} />
      <Route path="login" element={<Login />} />

      <Route path="dashboard" element={<EmployeeDashboard />} />

      <Route path="leads" element={<EmployeeLead />} />
      <Route path="schedule" element={<EmployeeSchedule />} />
      <Route path="profile" element={<EmployeeProfile />} />
    </Routes>
  );
};

export default EmployeeRoutes;
