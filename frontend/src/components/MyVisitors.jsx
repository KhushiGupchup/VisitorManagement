import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SidebarEmployee from "../components/EmployeeSidebar.jsx";
import api from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import Topbar from "./Topbar.jsx";

export default function MyVisitors() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (user === null) return;
    if (!user || user.role !== "employee") navigate("/login");
  }, [user, navigate]);

  const fetchVisitors = async () => {
    try {
      const res = await api.get("/employee/my-visitors");
      setVisitors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchVisitors();
  }, [user]);

  const handleToggle = async (visitor) => {
    setLoadingId(visitor._id);
    try {
      if (visitor.status === "pending") {
        await api.post(`/employee/approve-visitor/${visitor._id}`);
        alert("Visitor approved! QR and pass sent.");
      } else if (visitor.status === "approved") {
        if (!window.confirm("Are you sure you want to delete this visitor?")) return;
        await api.delete(`/employee/delete-visitor/${visitor._id}`);
        alert("Visitor deleted.");
      }
      fetchVisitors();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error updating visitor");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <SidebarEmployee />

      <div className="flex-1 flex flex-col overflow-auto">
        <Topbar />

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Visitors</h1>

          {visitors.length === 0 ? (
            <p className="text-gray-600">No visitors found.</p>
          ) : (
            <>
              {/* Table for desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded-lg">
                  <thead className="bg-teal-500 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Purpose</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Host</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map((v) => (
                      <tr key={v._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{v.name}</td>
                        <td className="px-4 py-2">{v.email}</td>
                        <td className="px-4 py-2">{v.phone}</td>
                        <td className="px-4 py-2">{v.purpose}</td>
                        <td className="px-4 py-2 capitalize">{v.status}</td>
                        <td className="px-4 py-2">{v.hostName} ({v.hostEmpId})</td>
                        <td className="px-4 py-2">{new Date(v.scheduledAt).toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleToggle(v)}
                            disabled={loadingId === v._id}
                            className={`px-3 py-1 rounded font-semibold transition
                              ${v.status === "pending" ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"}
                              ${loadingId === v._id ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {loadingId === v._id
                              ? v.status === "pending" ? "Approving..." : "Deleting..."
                              : v.status === "pending" ? "Approve" : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card layout for mobile */}
              <div className="md:hidden space-y-4">
                {visitors.map((v) => (
                  <div key={v._id} className="bg-white shadow rounded-lg p-4 space-y-2">
                    <p><span className="font-semibold">Name:</span> {v.name}</p>
                    <p><span className="font-semibold">Email:</span> {v.email}</p>
                    <p><span className="font-semibold">Phone:</span> {v.phone}</p>
                    <p><span className="font-semibold">Purpose:</span> {v.purpose}</p>
                    <p><span className="font-semibold">Status:</span> {v.status}</p>
                    <p><span className="font-semibold">Host:</span> {v.hostName} ({v.hostEmpId})</p>
                    <p><span className="font-semibold">Date:</span> {new Date(v.scheduledAt).toLocaleString()}</p>
                    <button
                      onClick={() => handleToggle(v)}
                      disabled={loadingId === v._id}
                      className={`mt-2 w-full px-3 py-2 rounded font-semibold transition
                        ${v.status === "pending" ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"}
                        ${loadingId === v._id ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {loadingId === v._id
                        ? v.status === "pending" ? "Approving..." : "Deleting..."
                        : v.status === "pending" ? "Approve" : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
