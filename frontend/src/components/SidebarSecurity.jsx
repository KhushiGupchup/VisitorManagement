import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function SidebarSecurity() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login
  };

  const linkClasses = (path) =>
    `block px-4 py-2 rounded-lg font-medium ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-200 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold">Security Panel</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            ></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 p-5 flex flex-col justify-between
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out
        md:translate-x-0 md:relative md:block z-50`}
      >
        <div>
          <h2 className="text-2xl font-bold mb-10">Security Panel</h2>

          <ul className="space-y-4">
            <li>
              <Link
                to="/security/dashboard"
                className={linkClasses("/security/dashboard")}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/security/scan"
                className={linkClasses("/security/scan")}
                onClick={() => setIsOpen(false)}
              >
                Scan QR
              </Link>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-10 w-full text-left text-red-400 hover:text-red-600 font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
