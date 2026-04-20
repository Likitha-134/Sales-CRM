import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";

import Employees from "./pages/Employees/Employees";
import Settings from "./pages/Settings/Settings";

import Leads from "./pages/Leads/Leads";
import EmployeeRoutes from "../src/employee/routes/EmployeeRoutes"

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <Dashboard />
        </MainLayout>
      } />
      <Route path="/leads" element={
        <MainLayout>
          <Leads/>
        </MainLayout>
      } />
      <Route path="/employees" element={
        <MainLayout>
          <Employees />
        </MainLayout>
      } />
      <Route path="/settings" element={
        <MainLayout>
          <Settings />
        </MainLayout>
      } />
      <Route path="/employee/*" element={<EmployeeRoutes />}/>
      
    </Routes>
  );
}

export default App;