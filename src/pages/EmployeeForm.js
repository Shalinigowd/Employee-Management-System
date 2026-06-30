import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getEmployee,
  createEmployee,
  updateEmployee,
} from "../services/api";

const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
  "Legal",
  "IT",
];

const STATUSES = ["ACTIVE", "INACTIVE", "ON_LEAVE"];

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  department: "",
  position: "",
  salary: "",
  dateOfJoining: "",
  status: "ACTIVE",
  address: "",
  gender: "MALE",
};

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    getEmployee(id)
      .then(({ data }) => {
        setForm({
          ...data,
          salary: data.salary || "",
          dateOfJoining: data.dateOfJoining || "",
        });
      })
      .catch(() => toast.error("Failed to load employee"))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);

    setLoading(true);

    try {
      const payload = {
        ...form,
        salary: form.salary ? parseFloat(form.salary) : null,
      };

      if (isEdit) {
        await updateEmployee(id, payload);
        toast.success("Employee updated successfully!");
      } else {
        await createEmployee(payload);
        toast.success("Employee created successfully!");
      }

      navigate("/employees");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
          <h1 className="page-title">
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </h1>

          <p className="page-subtitle">
            {isEdit
              ? "Update employee information"
              : "Fill in the details to add a new employee"}
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "1rem",
              fontWeight: "600",
              color: "var(--text-muted)",
            }}
          >
            Personal Information
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                First Name *
              </label>

              <input
                className="form-input"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Last Name *
              </label>

              <input
                className="form-input"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Email *
              </label>

              <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john.doe@company.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Gender *
              </label>

              <select
                className="form-input"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="MALE">👨 Male</option>
                <option value="FEMALE">👩 Female</option>
                <option value="OTHER">🧑 Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone Number *
              </label>

              <input
                className="form-input"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Address
            </label>

            <input
              className="form-input"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State"
            />
          </div>

          <hr
            style={{
              margin: "24px 0",
              border: "none",
              borderTop: "1px solid var(--border)",
            }}
          />

          <h3
            style={{
              marginBottom: "16px",
              fontSize: "1rem",
              fontWeight: "600",
              color: "var(--text-muted)",
            }}
          >
            Job Information
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Department *
              </label>

              <select
                className="form-input"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select department
                </option>

                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Position *
              </label>

              <input
                className="form-input"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Software Engineer"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Salary (₹)
              </label>

              <input
                className="form-input"
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="50000"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Date of Joining
              </label>

              <input
                className="form-input"
                type="date"
                name="dateOfJoining"
                value={form.dateOfJoining}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Status
              </label>

              <select
                className="form-input"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "💾 Update Employee"
                : "➕ Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}