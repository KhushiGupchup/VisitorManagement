import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function SidebarEmployee() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/employee/dashboard" },
    { name: "Schedule Visitor", path: "/employee/schedule-visitor" },
    { name: "My Visitors", path: "/employee/my-visitors" },
    { name: "Change Password", path: "/employee/change-password" },
  ];

  return (
    <>
      {/* Mobile hamburger top bar */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow-md z-50">
        <h2 className="text-xl font-bold">Menu</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-teal-600 font-bold text-2xl"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
  className={`
    bg-white shadow-lg p-6 flex flex-col justify-between
    fixed top-0 left-0 h-screen z-50
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:relative md:translate-x-0 md:h-screen md:w-64 md:flex
    w-64
  `}
>


        {/* Menu */}
        <div>
          <h2 className="text-xl font-bold mb-6 hidden md:block">Menu</h2>
          <ul className="space-y-3">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)} // close on mobile
                    className={`
                      block px-4 py-2 rounded-lg font-medium transition
                      ${isActive ? "bg-teal-600 text-white" : "hover:bg-teal-100 hover:text-teal-700"}
                    `}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-6 w-full text-left text-red-400 hover:text-red-600 font-semibold transition"
        >
          Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-25 z-40 md:hidden"
        ></div>
      )}
    </>
  );
}
