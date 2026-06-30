import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import EmployeeDetail from "./pages/EmployeeDetail";
import Attendance from "./pages/Attendance";
import Login from "./pages/Login";

import "./App.css";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
        />

        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <Layout>
                  <EmployeeList />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/employees/new"
            element={
              <PrivateRoute>
                <Layout>
                  <EmployeeForm />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <Layout>
                  <Attendance />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/employees/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <EmployeeDetail />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/employees/:id/edit"
            element={
              <PrivateRoute>
                <Layout>
                  <EmployeeForm />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;