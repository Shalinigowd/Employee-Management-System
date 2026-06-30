import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAttendance,
  getEmployees,
  markAttendance,
} from "../services/api";

export default function Attendance() {
  const today = new Date();

  const currentDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [viewStatus, setViewStatus] = useState("EMPLOYEES");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [attendanceRes, employeeRes] = await Promise.all([
        getAttendance(),
        getEmployees(),
      ]);

      setAttendance(attendanceRes.data);
      setEmployees(employeeRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  const saveAttendance = async (employeeId, status) => {
    try {
      await markAttendance({
        employeeId,
        attendanceDate: selectedDate,
        status,
      });

      toast.success("Attendance saved successfully.");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save attendance.");
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const filteredAttendance = attendance.filter(
    (a) => a.attendanceDate === selectedDate
  );

  const presentCount = filteredAttendance.filter(
    (a) => a.status === "PRESENT"
  ).length;

  const absentCount = filteredAttendance.filter(
    (a) => a.status === "ABSENT"
  ).length;

  const leaveCount = filteredAttendance.filter(
    (a) => a.status === "LEAVE"
  ).length;

  const totalMarked = filteredAttendance.length;
  const totalEmployees = employees.length;  
  console.log(employees);
  console.log(attendance);

    return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 className="page-title">Attendance Management</h1>
          <p style={{ color: "#64748b" }}>
            Mark employee attendance for today
          </p>
        </div>

        <div
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          📅 {currentDate}
        </div>
      </div>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "15px",
    marginBottom: "20px",
  }}
>
  {/* Total Employees */}
  <div
    className="card attendance-card"
    style={{
      textAlign: "center",
      cursor: "pointer",
      border: viewStatus === "EMPLOYEES" ? "2px solid #2563eb" : "",
    }}
    onClick={() => setViewStatus("EMPLOYEES")}
  >
    <h3>👥 Total Employees</h3>
    <h2>{totalEmployees}</h2>
  </div>

  {/* Present */}
  <div
    className="card attendance-card"
    style={{
      textAlign: "center",
      cursor: "pointer",
      border: viewStatus === "PRESENT" ? "2px solid #22c55e" : "",
    }}
    onClick={() => setViewStatus("PRESENT")}
  >
    <h3>✅ Present</h3>
    <h2>{presentCount}</h2>
  </div>

  {/* Absent */}
  <div
    className="card attendance-card"
    style={{
      textAlign: "center",
      cursor: "pointer",
      border: viewStatus === "ABSENT" ? "2px solid red" : "",
    }}
    onClick={() => setViewStatus("ABSENT")}
  >
    <h3>❌ Absent</h3>
    <h2>{absentCount}</h2>
  </div>

  {/* Leave */}
  <div
    className="card attendance-card"
    style={{
      textAlign: "center",
      cursor: "pointer",
      border: viewStatus === "LEAVE" ? "2px solid orange" : "",
    }}
    onClick={() => setViewStatus("LEAVE")}
  >
    <h3>🏖 Leave</h3>
    <h2>{leaveCount}</h2>
  </div>

  {/* Total Marked */}
  <div
    className="card attendance-card"
    style={{
      textAlign: "center",
      cursor: "pointer",
      border: viewStatus === "MARKED" ? "2px solid #7c3aed" : "",
    }}
    onClick={() => setViewStatus("MARKED")}
  >
    <h3>👥 Total Marked</h3>
    <h2>{totalMarked}</h2>
  </div>
</div>
      <div
        className="card"
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          className="form-input"
          style={{ flex: 2 }}
          placeholder="🔍 Search Employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          className="form-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <select
          className="form-input"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="ALL">All Departments</option>

          {[...new Set(employees.map((emp) => emp.department))].map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employees
                .filter((emp) => {
  const existing = attendance.find(
    (a) =>
      a.employeeId === emp.id &&
      a.attendanceDate === selectedDate
  );

  const matchesSearch =
    `${emp.id} ${emp.firstName} ${emp.lastName} ${emp.email} ${emp.department}`
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesDepartment =
    selectedDepartment === "ALL" ||
    emp.department === selectedDepartment;

  // Show all employees
  if (viewStatus === "EMPLOYEES") {
    return matchesSearch && matchesDepartment;
  }

  // Show only marked employees
  if (viewStatus === "MARKED") {
    return (
      existing &&
      matchesSearch &&
      matchesDepartment
    );
  }

  // Present / Absent / Leave
  return (
    existing &&
    existing.status === viewStatus &&
    matchesSearch &&
    matchesDepartment
  );
})
                .map((emp) => {
                  const existing = attendance.find(
                    (a) =>
                      a.employeeId === emp.id &&
                      a.attendanceDate === selectedDate
                  );

                  return (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>

                      <td>
                        <div>
                          <strong>
                            {emp.firstName} {emp.lastName}
                          </strong>
                          <br />
                          <small style={{ color: "#64748b" }}>
                            {emp.email}
                          </small>
                        </div>
                      </td>

                      <td>{emp.department}</td>

                      <td>{selectedDate}</td>

                      <td>
                        <select
                          className="form-input"
                          defaultValue={existing?.status || "PRESENT"}
                          onChange={(e) => {
                            emp.selectedStatus = e.target.value;
                          }}
                        >
                          <option value="PRESENT">✅ Present</option>
                          <option value="ABSENT">❌ Absent</option>
                          <option value="LEAVE">🏖 Leave</option>
                        </select>
                      </td>

                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            saveAttendance(
                              emp.id,
                              emp.selectedStatus ||
                                existing?.status ||
                                "PRESENT"
                            )
                          }
                        >
                          💾 Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {employees.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#64748b",
              }}
            >
              No employees found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}