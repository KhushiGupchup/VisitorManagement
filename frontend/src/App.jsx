import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./components/Landing";
import LoginPage from "./components/LoginPage";
import VisitorRegistration from "./components/VisitorRegister";
import Dashboard from "./components/Dashboard";
import AddEmployee from "./components/AddEmployee";
import EmployeeList from "./components/EmployeeList";
import VisitorList from "./components/VisitorList";
import EmployeeDashboard from "./components/EmployeeDashboard";
import PrivateRoute from "./components/PrivateRoute";
import MyVisitors from "./components/MyVisitors";
import ScheduleVisitor from "./components/ScheduleVisitor";
import ChangePassword from "./components/ChangePassword";

import SecurityDashboard from "./components/SecurityDashboard";
import ScanQR from "./components/ScanQR";
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/visitor-register" element={<VisitorRegistration />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-employee"
          element={
            <PrivateRoute role="admin">
              <AddEmployee />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/see-employees"
          element={
            <PrivateRoute role="admin">
              <EmployeeList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/see-visitors"
          element={
            <PrivateRoute role="admin">
              <VisitorList />
            </PrivateRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <PrivateRoute role="employee">
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/employee/my-visitors"
          element={
            <PrivateRoute role="employee">
              <MyVisitors />
            </PrivateRoute>
          }
        />

        <Route
          path="/employee/schedule-visitor"
          element={
            <PrivateRoute role="employee">
              <ScheduleVisitor />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/change-password"
          element={
            <PrivateRoute role="employee">
              <ChangePassword />
            </PrivateRoute>
          }
        />
        {/* Security  /security/dashboard   /security/scan*/}
        <Route
          path="/security/dashboard"
          element={
            <PrivateRoute role="security">
              <SecurityDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/security/scan"
          element={
            <PrivateRoute role="security">
              <ScanQR />
            </PrivateRoute>
          }
        />


        {/* Fallback */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
