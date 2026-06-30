import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getEmployees,
  deleteEmployee,
  searchEmployees,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("");
  const [deleting, setDeleting] = useState(null);

  const { isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      employees.map((emp) => ({
        Name: `${emp.firstName} ${emp.lastName}`,
        Email: emp.email,
        Department: emp.department,
        Position: emp.position,
        Phone: emp.phoneNumber,
        Salary: emp.salary,
        Status: emp.status,
      }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Employees"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "employees.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Employee Report", 14, 20);

    const tableColumn = [
      "Name",
      "Email",
      "Department",
      "Position",
      "Phone",
      "Status",
    ];

    const tableRows = employees.map((emp) => [
      `${emp.firstName} ${emp.lastName}`,
      emp.email,
      emp.department,
      emp.position,
      emp.phoneNumber,
      emp.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("employees.pdf");
  };

  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await getEmployees();
      setEmployees(data);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = async (e) => {
    const val = e.target.value;

    setSearch(val);

    if (!val.trim()) {
      fetchEmployees();
      return;
    }

    try {
      const { data } = await searchEmployees(val);
      setEmployees(data);
    } catch {
      toast.error("Search failed");
    }
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${name}?`
      )
    )
      return;

    setDeleting(id);

    try {
      await deleteEmployee(id);
      toast.success(`${name} deleted successfully`);
      fetchEmployees();
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setDeleting(null);
    }
  };

  const statusClass = (s) => {
    if (s === "ACTIVE") return "badge-active";
    if (s === "INACTIVE") return "badge-inactive";
    return "badge-leave";
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            {employees.length} employees total
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            className="btn btn-success"
            onClick={exportToExcel}
          >
            📄 Export Excel
          </button>

          <button
            className="btn btn-pdf"
            onClick={exportToPDF}
          >
            📕 Export PDF
          </button>

          {isManager() && (
            <Link
              to="/employees/new"
              className="btn btn-primary"
            >
              ➕ Add Employee
            </Link>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: "16px" }}>
          <select
            className="form-input"
            value={departmentFilter}
            onChange={(e) =>
              setDepartmentFilter(e.target.value)
            }
            style={{ marginBottom: "16px" }}
          >
            <option value="">
              All Departments
            </option>
            <option value="Engineering">
              Engineering
            </option>
            <option value="Human Resources">
              Human Resources
            </option>
            <option value="Finance">
              Finance
            </option>
            <option value="Marketing">
              Marketing
            </option>
            <option value="Sales">
              Sales
            </option>
            <option value="Operations">
              Operations
            </option>
            <option value="Legal">
              Legal
            </option>
            <option value="IT">
              IT
            </option>
          </select>

          <div className="search-bar">
            <span className="search-icon">🔍</span>

            <input
              className="form-input"
              type="text"
              placeholder="Search by name, email, department, position..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>

            <p>No employees found.</p>

            {isManager() && (
              <Link
                to="/employees/new"
                className="btn btn-primary"
                style={{ marginTop: "12px" }}
              >
                Add First Employee
              </Link>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Phone</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees
                  .filter(
                    (emp) =>
                      departmentFilter === "" ||
                      emp.department ===
                        departmentFilter
                  )
                  .map((emp) => (
                    <tr
                      key={emp.id}
                      style={{
                        transition: "0.25s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "#f8fafc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "white")
                      }
                    >
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
                                emp.gender ===
                                "FEMALE"
                                  ? "#FCE7F3"
                                  : emp.gender ===
                                    "OTHER"
                                  ? "#EDE9FE"
                                  : "#DBEAFE",
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                "center",
                              fontSize: "24px",
                            }}
                          >
                            {emp.gender ===
                            "FEMALE"
                              ? "👩"
                              : emp.gender ===
                                "OTHER"
                              ? "🧑"
                              : "👨"}
                          </div>

                          <div>
                            <div
                              style={{
                                fontWeight:
                                  "500",
                              }}
                            >
                              {emp.firstName}{" "}
                              {emp.lastName}
                            </div>

                            <div
                              style={{
                                fontSize:
                                  "0.8rem",
                                color:
                                  "var(--text-muted)",
                              }}
                            >
                              {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>{emp.department}</td>

                      <td>{emp.position}</td>

                      <td>{emp.phoneNumber}</td>

                      <td>
                        {emp.salary
                          ? `₹${emp.salary.toLocaleString()}`
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`badge ${statusClass(
                            emp.status
                          )}`}
                        >
                          {emp.status ===
                            "ACTIVE" &&
                            "🟢 Active"}

                          {emp.status ===
                            "INACTIVE" &&
                            "🔴 Inactive"}

                          {emp.status ===
                            "ON_LEAVE" &&
                            "🟡 On Leave"}
                        </span>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                          }}
                        >
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              navigate(
                                `/employees/${emp.id}`
                              )
                            }
                          >
                            👁 View
                          </button>

                          {isManager() && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                navigate(
                                  `/employees/${emp.id}/edit`
                                )
                              }
                            >
                              ✏️ Edit
                            </button>
                          )}

                          {isAdmin() && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleDelete(
                                  emp.id,
                                  `${emp.firstName} ${emp.lastName}`
                                )
                              }
                              disabled={
                                deleting ===
                                emp.id
                              }
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}