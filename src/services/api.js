import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

// Auth
export const login = (credentials) =>
  api.post("/auth/login", credentials);

export const register = (data) =>
  api.post("/auth/register", data);

// Employees
export const getEmployees = () =>
  api.get("/employees");

export const getEmployee = (id) =>
  api.get(`/employees/${id}`);

export const createEmployee = (data) =>
  api.post("/employees", data);

export const updateEmployee = (id, data) =>
  api.put(`/employees/${id}`, data);

export const deleteEmployee = (id) =>
  api.delete(`/employees/${id}`);

export const searchEmployees = (keyword) =>
  api.get(`/employees/search?keyword=${keyword}`);

export const getDepartments = () =>
  api.get("/employees/departments");

export const getDashboardStats = () =>
  api.get("/employees/dashboard/stats");

// Attendance
export const getAttendance = () =>
  api.get("/attendance");

export const markAttendance = (data) =>
  api.post("/attendance", data);

export default api;