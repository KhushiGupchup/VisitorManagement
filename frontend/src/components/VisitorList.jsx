import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import api from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import Topbar from "./Topbar.jsx";

export default function VisitorList() {
  const [visitors, setVisitors] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    const fetchVisitors = async () => {
      try {
        const res = await api.get("/admin/visitors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVisitors(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) logout();
      }
    };

    fetchVisitors();
  }, [navigate, user, logout]);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "approved":
      case "completed":
        return "text-green-600";
      case "rejected":
      case "denied":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <div className="p-6 flex-1 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">All Visitors</h1>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {visitors.length > 0 ? (
              visitors.map((v) => (
                <div key={v._id} className="bg-white p-4 rounded-lg shadow">
                  <p><span className="font-semibold">Name:</span> {v.name}</p>
                  <p><span className="font-semibold">Email:</span> {v.email}</p>
                  <p><span className="font-semibold">Phone:</span> {v.phone}</p>
                  <p><span className="font-semibold">Host:</span> {v.host}</p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={getStatusColor(v.status)}>{v.status}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No visitors found.</p>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded border">
              <thead>
                <tr className="bg-teal-200 text-left">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Host</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {visitors.length > 0 ? (
                  visitors.map((v) => (
                    <tr key={v._id} className="border-t">
                      <td className="px-4 py-2">{v.name}</td>
                      <td className="px-4 py-2">{v.email}</td>
                      <td className="px-4 py-2">{v.phone}</td>
                      <td className="px-4 py-2">{v.host}</td>
                      <td className={`px-4 py-2 font-semibold ${getStatusColor(v.status)}`}>
                        {v.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                      No visitors found.
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
