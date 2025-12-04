import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import NavbarComponent from "./Navbar_new";
import logoVisio from "../assets/logo_visio.png";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    login({ email: res.data.email, role: res.data.role });

    if (res.data.role === "admin") {
      navigate("/admin/dashboard");
    } else if (res.data.role === "employee") {
      navigate("/employee/dashboard");
    } else if (res.data.role === "security") {
      navigate("/security/dashboard");
    } else {
      alert("Unknown role");
    }
  } catch (err) {
    alert(err.response?.data?.msg || "Login failed");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-500 flex flex-col items-center justify-center px-4">
      <NavbarComponent />

      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8 mt-24 flex flex-col items-center">
        {/* Logo */}
        <img src={logoVisio} alt="Visio Logo" className="h-16 w-auto mb-4" />
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-3 w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
          <button className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
