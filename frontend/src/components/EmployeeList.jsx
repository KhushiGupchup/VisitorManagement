import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import api from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch employees
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    const fetchEmployees = async () => {
      try {
        const res = await api.get("/admin/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) logout();
      }
    };

    fetchEmployees();
  }, [navigate, user, logout]);

  // Handle delete
  const handleDelete = async (empId) => {
    if (!window.confirm("Are you sure? This will delete the employee and all related visitors.")) return;

    try {
      setLoadingId(empId);
      const token = localStorage.getItem("token");
      await api.delete(`/admin/employee/${empId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmployees(employees.filter((emp) => emp.empId !== empId));
      alert("Employee and related visitors deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error deleting employee");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <div className="p-6 flex-1 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">All Employees</h1>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <div key={emp._id} className="bg-white p-4 rounded-lg shadow">
                  <p><span className="font-semibold">Employee ID:</span> {emp.empId}</p>
                  <p><span className="font-semibold">Name:</span> {emp.name}</p>
                  <p><span className="font-semibold">Email:</span> {emp.email}</p>
                  <button
                    onClick={() => handleDelete(emp.empId)}
                    disabled={loadingId === emp.empId}
                    className={`mt-2 px-3 py-1 rounded font-semibold text-white ${
                      loadingId === emp.empId
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {loadingId === emp.empId ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No employees found.</p>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full shadow rounded border bg-white">
              <thead>
                <tr className="bg-teal-200 text-left">
                  <th className="px-4 py-2">Employee ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp._id} className="border-t">
                      <td className="px-4 py-2">{emp.empId}</td>
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">{emp.email}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDelete(emp.empId)}
                          disabled={loadingId === emp.empId}
                          className={`px-3 py-1 rounded font-semibold text-white ${
                            loadingId === emp.empId
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {loadingId === emp.empId ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
