// LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import NavbarComponent from "./Navbar_new";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-500 flex flex-col text-white relative overflow-hidden pt-16">

      {/* Floating background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>

      {/* Navbar */}
      <NavbarComponent />

      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center mt-12 sm:mt-16 px-4 sm:px-10 py-32 relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-3xl leading-tight">
          Welcome to Visio
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl mt-6 max-w-2xl leading-relaxed">
          Register your visit in just a few clicks and get your digital visitor pass. 
          Seamless, fast, and secure check-in awaits you!
        </p>

        {/* Call-to-action buttons */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/visitor-register"
            className="bg-white text-teal-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition transform hover:scale-105 font-semibold"
          >
            Get Your Pass
          </Link>

          <Link
            to="/login"
            className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-teal-600 transition transform hover:scale-105 font-semibold"
          >
            Already Registered? Login
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
