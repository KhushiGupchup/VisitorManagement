import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const username = user?.email?.split("@")[0] || "User";

  return (
    <div className="h-20 bg-white shadow flex justify-end items-center px-8 relative">

      {/* Profile Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4 bg-teal-100 hover:bg-teal-200 px-5 py-2 rounded-lg font-medium text-gray-700"
      >
        <span>{username}</span>
        <FontAwesomeIcon icon={dropdownOpen ? faChevronUp : faChevronDown} className="w-4 h-4" />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-2 mt-33 w-56 bg-gray-200 shadow-lg rounded-b-xl text-center">
          <div className="px-4 py-2 text-gray-700 border-b">
            {user?.email}
          </div>
          <button
            onClick={logout}
            className="w-full text-center px-4 py-2 hover:bg-red-300 hover:text-white transition font-bold text-gray-700 rounded-b-lg "
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
