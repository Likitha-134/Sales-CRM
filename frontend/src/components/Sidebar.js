import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <span className="canovo">Canovo</span>
        <span className="crm">CRM</span>
      </div>

      <nav className="menu">
        <NavLink to="/" className="menu-item">Dashboard</NavLink>
        <NavLink to="/leads" className="menu-item">Leads</NavLink>
        <NavLink to="/employees" className="menu-item">Employees</NavLink>
        <NavLink to="/settings" className="menu-item">Settings</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;