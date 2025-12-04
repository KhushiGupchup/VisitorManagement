import { useContext, useEffect, useState } from "react";
import SidebarEmployee from "../components/EmployeeSidebar";
import api from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Topbar from "./Topbar.jsx";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ myVisitors: 0, pendingVisitors: 0 });
  const [loading, setLoading] = useState(true);

  // Redirect if not employee
  useEffect(() => {
    if (user === null) return;
    if (!user || user.role !== "employee") navigate("/login");
  }, [user, navigate]);

  // Fetch dashboard stats
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/employee/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarEmployee className="w-full md:w-64 flex-shrink-0" />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <Topbar />

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-700">My Visitors</h3>
            <p className="text-4xl font-bold mt-4 text-blue-600">
              {loading ? "..." : stats.myVisitors}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-700">Pending Visitors</h3>
            <p className="text-4xl font-bold mt-4 text-yellow-500">
              {loading ? "..." : stats.pendingVisitors}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
