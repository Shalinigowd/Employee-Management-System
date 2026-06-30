import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmployee, deleteEmployee } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployee(id)
      .then(({ data }) => setEmployee(data))
      .catch(() => {
        toast.error("Employee not found");
        navigate("/employees");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete ${employee.firstName} ${employee.lastName}?`
      )
    )
      return;

    try {
      await deleteEmployee(id);
      toast.success("Employee deleted");
      navigate("/employees");
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!employee) return null;

  const statusClass =
    employee.status === "ACTIVE"
      ? "badge-active"
      : employee.status === "INACTIVE"
      ? "badge-inactive"
      : "badge-leave";

  return (
    <div>
      <div className="page-header">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          {isManager() && (
            <Link
              to={`/employees/${id}/edit`}
              className="btn btn-primary"
            >
              ✏️ Edit
            </Link>
          )}

          {isAdmin() && (
            <button
              className="btn btn-danger"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "28px",
            paddingBottom: "24px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            className="avatar"
            style={{
              width: "64px",
              height: "64px",
              fontSize: "1.5rem",
            }}
          >
            {employee.firstName[0]}
            {employee.lastName[0]}
          </div>

          <div>
            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: "700",
              }}
            >
              {employee.firstName} {employee.lastName}
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              {employee.position} • {employee.department}
            </p>

            <span
              className={`badge ${statusClass}`}
              style={{ marginTop: "6px" }}
            >
              {employee.status}
            </span>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <label>📧 Email</label>
            <p>{employee.email}</p>
          </div>

          <div className="detail-item">
            <label>📱 Phone</label>
            <p>{employee.phoneNumber}</p>
          </div>

          <div className="detail-item">
            <label>🏢 Department</label>
            <p>{employee.department}</p>
          </div>

          <div className="detail-item">
            <label>💼 Position</label>
            <p>{employee.position}</p>
          </div>

          <div className="detail-item">
            <label>💰 Salary</label>
            <p>
              {employee.salary
                ? `₹${employee.salary.toLocaleString()}`
                : "Not specified"}
            </p>
          </div>

          <div className="detail-item">
            <label>📅 Date of Joining</label>
            <p>{employee.dateOfJoining || "Not specified"}</p>
          </div>

          <div className="detail-item">
            <label>📍 Address</label>
            <p>{employee.address || "Not specified"}</p>
          </div>

          <div className="detail-item">
            <label>🕐 Created At</label>
            <p>{employee.createdAt || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}