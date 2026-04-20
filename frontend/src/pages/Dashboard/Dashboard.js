import SalesGraph from "../../components/SalesGraph";
import { FaUser, FaChartLine, FaUsers, FaPercent } from "react-icons/fa";
import "../../styles/Dashboard.css";
import { useEffect, useState } from "react";
import API from "../../services/api";

const Dashboard = () => {
  const [activities, setActivities] = useState([]);

  const [stats, setStats] = useState({
    unassignedLeads: 0,
    assignedThisWeek: 0,
    activeSales: 0,
    conversionRate: 0,
  });
  const [graphData, setGraphData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, empRes, graphRes, actRes] = await Promise.all([
          API.get("/dashboard/stats"),
          API.get("/dashboard/active-sales"),
          API.get("/dashboard/sales-graph"),
          API.get("/dashboard/recent-activity"),
        ]);

        setStats(statsRes.data);
        setEmployees(empRes.data);
        setGraphData(graphRes.data);
        setActivities(actRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);
  useEffect(() => {
    setFilteredEmployees(employees);
    setFilteredActivities(activities);

    const handler = (e) => {
      const q = e.detail.toLowerCase();

      setFilteredEmployees(
        employees.filter((emp) => emp.name?.toLowerCase().includes(q)),
      );

      setFilteredActivities(
        activities.filter((a) => a.text?.toLowerCase().includes(q)),
      );
    };

    window.addEventListener("globalSearch", handler);

    return () => window.removeEventListener("globalSearch", handler);
  }, [employees, activities]);
  return (
    <div className="dashboard">
      {/* Breadcrumb */}
      <div className="breadcrumb">Home &gt; Dashboard</div>

      {/* KPI CARDS */}
      <div className="kpi-container">
        <div className="kpi-card">
          <div className="kpi-header">
            <p>Unassigned Leads</p>
            <FaUser className="icon" />
          </div>
          <h2>{stats.unassignedLeads}</h2>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <p>Assigned This Week</p>
            <FaChartLine className="icon" />
          </div>
          <h2>{stats.assignedThisWeek}</h2>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <p>Active Salespeople</p>
            <FaUsers className="icon" />
          </div>
          <h2>{stats.activeSales}</h2>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <p>Conversion Rate</p>
            <FaPercent className="icon" />
          </div>
          <h2>{stats.conversionRate}%</h2>
        </div>
      </div>

      {/* GRAPH + ACTIVITY */}
      <div className="middle-section">
        {/* GRAPH */}
        <div className="graph-box">
          <h3>Sales Analytics</h3>
          <SalesGraph data={graphData} />
        </div>

        {/* ACTIVITY */}
        <div className="activity-box">
          <h3>Recent Activity Feed</h3>

          <div className="activity-list">
            {filteredActivities.map((a, i) => (
              <div className="activity-item" key={i}>
                {a.text}
                <span>
                  – {a.time || new Date(a.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE EMPLOYEES */}
      <div className="sales-box">
        <h3>Active Sales People</h3>

        <div className="sales-list">
          {/* HEADER */}
          <div className="sales-header">
            <div>Name</div>
            <div>Employee ID</div>
            <div>Assigned Leads</div>
            <div>Closed Leads</div>
            <div>Status</div>
          </div>
          {filteredEmployees
            .filter((emp) => emp.assignedLeads > 0)
            .map((emp, index) => {
              const initials = emp.name
                ? emp.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                : "";

              return (
                <div className="sales-item" key={emp._id}>
                  {/* 1  NAME */}
                  <div className="emp-name-col">
                    <div className="avatar">{initials.toUpperCase()}</div>
                    <div>
                      <div className="emp-name">{emp.name}</div>
                      <div className="emp-email">{emp.email}</div>
                    </div>
                  </div>

                  {/* 2  EMPLOYEE ID */}
                  <div>
                    <span className="emp-id-tag">
                      {emp._id.slice(0, 12)}...
                    </span>
                  </div>

                  {/* 3  ASSIGNED */}
                  <div className="assigned-col">{emp.assignedLeads}</div>

                  {/* 4  CLOSED */}
                  <div className="closed-col">{emp.closedLeads}</div>

                  {/* 5  STATUS */}
                  <div>
                    <span
                      className={`status-pill ${emp.assignedLeads > 0 ? "status-active" : "status-inactive"}`}
                    >
                      <span className="status-dot"></span>
                      {emp.assignedLeads > 0 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
