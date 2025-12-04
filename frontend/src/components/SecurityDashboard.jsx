import { useEffect, useState } from "react";
import SidebarSecurity from "../components/SidebarSecurity";
import api from "../utils/api.js";

export default function SecurityDashboard() {
  const [visitorLogs, setVisitorLogs] = useState([]);

  useEffect(() => {
    async function fetchVisitorLogs() {
      try {
        const res = await api.get("/security/visitor-logs");
        setVisitorLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchVisitorLogs();
  }, []);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarSecurity />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Security Dashboard</h1>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          {visitorLogs.length > 0 ? (
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Check-In</th>
                  <th className="px-4 py-2">Check-Out</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {visitorLogs.map((log) => {
                  const isInside = log.checkIn && !log.checkOut;
                  return (
                    <tr
                      key={log._id}
                      className={`border-t ${isInside ? "bg-green-100" : ""}`}
                    >
                      <td className="px-4 py-2">{log.name}</td>
                      <td className="px-4 py-2">{log.email}</td>
                      <td className="px-4 py-2">{formatDateTime(log.checkIn)}</td>
                      <td className="px-4 py-2">{formatDateTime(log.checkOut)}</td>
                      <td className="px-4 py-2">
                        {isInside
                          ? "Inside"
                          : log.checkOut
                          ? "Exited"
                          : "Not checked in"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-6">No visitors found.</p>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {visitorLogs.length > 0 ? (
            visitorLogs.map((log) => {
              const isInside = log.checkIn && !log.checkOut;
              return (
                <div
                  key={log._id}
                  className={`bg-white shadow rounded-lg p-4 border-l-4 ${
                    isInside ? "border-green-500" : "border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-lg">{log.name}</p>
                  <p className="text-gray-600 text-sm">{log.email}</p>
                  <p className="text-sm mt-2">
                    <span className="font-semibold">Check-In:</span>{" "}
                    {formatDateTime(log.checkIn)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Check-Out:</span>{" "}
                    {formatDateTime(log.checkOut)}
                  </p>
                  <p
                    className={`mt-2 font-semibold ${
                      isInside ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {isInside
                      ? "Inside"
                      : log.checkOut
                      ? "Exited"
                      : "Not checked in"}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-gray-300 text-center text-gray-500">
              No visitors found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
