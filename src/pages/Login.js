import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10,25,50,.45), rgba(10,25,50,.45)), url('/login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <img
              src={logo}
              alt="EMS Logo"
              className="login-logo"
            />

            <h1>Employee Management System</h1>

            <p>Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Username
              </label>

              <input
                className="form-input"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Password
              </label>

              <input
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "12px",
              }}
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "🔐 Sign In"}
            </button>
          </form>

          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: "#f0f9ff",
              borderRadius: "8px",
              fontSize: "0.8rem",
              color: "#64748b",
            }}
          >
            <strong>Default credentials:</strong>
            <br />
            Username: <code>admin</code> | Password:{" "}
            <code>admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
}