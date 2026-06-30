import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaUmbrellaBeach,
  FaBuilding,
  FaMoneyBillWave,
  FaPlus,
} from "react-icons/fa";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getDashboardStats, getEmployees } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    Promise.all([getDashboardStats(), getEmployees()])
      .then(([statsRes, empRes]) => {
        console.log(statsRes.data);

        setStats(statsRes.data);

        setEmployees(empRes.data);

        setRecentEmployees(
          [...empRes.data]
            .sort((a, b) => b.id - a.id)
            .slice(0, 5)
        );
      })
      .catch(() => {
        toast.error("Failed to load dashboard");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const statusData = [
    {
      name: "Active",
      value: stats?.activeEmployees || 0,
    },
    {
      name: "On Leave",
      value: stats?.onLeave || 0,
    },
    {
      name: "Inactive",
      value:
        (stats?.totalEmployees || 0) -
        (stats?.activeEmployees || 0) -
        (stats?.onLeave || 0),
    },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  const departmentData = Object.values(
    employees.reduce((acc, emp) => {
      const department = emp.department || "Others";

      if (!acc[department]) {
        acc[department] = {
          department,
          employees: 0,
        };
      }

      acc[department].employees += 1;

      return acc;
    }, {})
  );

  const BAR_COLORS = [
    "#2563eb",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
  ];

  const statCards = [
    {
      icon: <FaUsers />,
      label: "Total Employees",
      value: stats?.totalEmployees || 0,
      color: "#2563eb",
    },
    {
      icon: <FaUserCheck />,
      label: "Present Today",
      value: stats?.presentToday || 0,
      color: "#16a34a",
    },
    {
      icon: <FaUserTimes />,
      label: "Absent Today",
      value: stats?.absentToday || 0,
      color: "#dc2626",
    },
    {
      icon: <FaUmbrellaBeach />,
      label: "Leave Today",
      value: stats?.leaveToday || 0,
      color: "#d97706",
    },
    {
      icon: <FaBuilding />,
      label: "Departments",
      value: stats?.departments?.length || 0,
      color: "#7c3aed",
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Payroll",
      value: `₹${Number(stats?.totalPayroll || 0).toLocaleString("en-IN")}`,
      color: "#059669",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome back, {user?.username} 👋
          </h1>

          <p className="page-subtitle">
            Here's what's happening in your organization today
          </p>
        </div>

        <Link
          to="/employees/new"
          className="btn btn-primary"
        >
          <FaPlus style={{ marginRight: "8px" }} />
          Add Employee
        </Link>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="card stat-card"
            style={{
              borderTop: `4px solid ${stat.color}`,
            }}
          >
            <div
              className="stat-icon"
              style={{
                background: `${stat.color}15`,
                color: stat.color,
              }}
            >
              {stat.icon}
            </div>

            <div
              className="stat-value"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>

            <div className="stat-label">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Departments */}

      {stats?.departments?.length > 0 && (
        <div
          className="card"
          style={{ marginTop: "16px" }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            Departments
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {stats.departments.map((dept) => (
              <Link
                key={dept}
                to={`/employees?dept=${dept}`}
                style={{
                  padding: "6px 14px",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  borderRadius: "100px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  textDecoration: "none",
                }}
              >
                🏢 {dept}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Employees */}

      <div
        className="card"
        style={{ marginTop: "20px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Recent Employees
          </h2>

          <Link
            to="/employees"
            className="btn btn-secondary btn-sm"
          >
            View All →
          </Link>
        </div>

        {recentEmployees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>

            <p>
              No employees yet.
              <Link to="/employees/new">
                {" "}
                Add the first one!
              </Link>
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {recentEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            background:
                              emp.gender === "FEMALE"
                                ? "#FCE7F3"
                                : emp.gender === "OTHER"
                                ? "#EDE9FE"
                                : "#DBEAFE",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "24px",
                          }}
                        >
                          {emp.gender === "FEMALE"
                            ? "👩"
                            : emp.gender === "OTHER"
                            ? "🧑"
                            : "👨"}
                        </div>

                        <div>
                          <div
                            style={{
                              fontWeight: "500",
                            }}
                          >
                            {emp.firstName} {emp.lastName}
                          </div>

                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>{emp.department}</td>

                    <td>{emp.position}</td>

                    <td>
                      <span
                        className={`badge ${
                          emp.status === "ACTIVE"
                            ? "badge-active"
                            : emp.status === "INACTIVE"
                            ? "badge-inactive"
                            : "badge-leave"
                        }`}
                      >
                        {emp.status === "ACTIVE" && "🟢 Active"}
                        {emp.status === "INACTIVE" && "🔴 Inactive"}
                        {emp.status === "ON_LEAVE" && "🟡 On Leave"}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/employees/${emp.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Charts */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "24px",
        }}
      >
        <div className="card">
          <h2 style={{ marginBottom: "15px" }}>
            Employee Status
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  `${value} Employees`,
                  name,
                ]}
              />

              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: "15px" }}>
            Department Overview
          </h2>

          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={departmentData}>
              <CartesianGrid
                stroke="#e5e7eb"
                vertical={false}
              />

              <XAxis
                dataKey="department"
                interval={0}
                angle={-20}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="employees"
                radius={[8, 8, 0, 0]}
              >
                {departmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      BAR_COLORS[
                        index % BAR_COLORS.length
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}