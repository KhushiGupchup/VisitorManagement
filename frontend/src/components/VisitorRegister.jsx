import { useState } from "react";
import axios from "axios";
import NavbarComponent from "./Navbar_new";
import logoVisio from "../assets/logo_visio.png";

export default function VisitorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    visitingTo: "",
    description: "",
    slot: "",
    photo: null,
  });

  const [preview, setPreview] = useState("");
  const [slots, setSlots] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "visitingTo") {
      setSlots(value.trim() ? ["09:00 AM", "11:00 AM", "02:00 PM"] : []);
      setFormData((prev) => ({ ...prev, slot: "" }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, photo: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        hostEmpId: Number(formData.visitingTo),
        purpose: formData.description,
        scheduledAt: formData.slot,
      }).forEach(([key, value]) => data.append(key, value));

      if (formData.photo) data.append("photo", formData.photo);

      const res = await axios.post("http://localhost:5000/api/visitor/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.msg);

      setFormData({
        name: "",
        email: "",
        phone: "",
        visitingTo: "",
        description: "",
        slot: "",
        photo: null,
      });
      setPreview("");
      setSlots([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error registering visitor");
    }
  };

  const Label = ({ htmlFor, children, required }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const InputField = ({ label, name, type = "text", required = false }) => (
    <div>
      <Label htmlFor={name} required={required}>{label}</Label>
      <input
        id={name}
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm w-full focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-teal-500 to-blue-500 text-gray-900">
      {/* Navbar */}
      <NavbarComponent />

      {/* Main content */}
      <main className="flex-1 flex justify-center px-4 py-3 overflow-auto pt-24">
         
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-4 space-y-1"
        >
          {/* Logo on top */}
          <div className="flex justify-center items-center">
            <img src={logoVisio} alt="Visio Logo" className="h-16 w-auto mb-4" />
         

         

          </div>
           <h2 className="text-2xl font-bold text-center">Visitor Registration</h2>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <InputField label="Full Name" name="name" required />
              <InputField label="Email Address" name="email" type="email" required />
              <InputField label="Phone Number" name="phone" required />
              <InputField label="Visiting To (Employee ID)" name="visitingTo" required />

              <div>
                <Label htmlFor="description" required>Reason for Visit</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  required
                  placeholder="Purpose of your visit"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm w-full focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col justify-start items-center space-y-6">
              {/* Photo Upload */}
              <div className="flex flex-col items-center w-full max-w-xs">
                <Label htmlFor="photo-upload">Upload Photo (Optional)</Label>
                <div className="mt-2 flex flex-col items-center space-y-2">
                  <div className="h-32 w-32 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400 overflow-hidden">
                    {preview ? <img src={preview} className="h-full w-full object-cover" /> : "No Photo"}
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer bg-teal-600 text-white rounded-md px-4 py-1.5 text-sm hover:bg-teal-700"
                  >
                    Choose
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Slot Select */}
              <div className="w-full max-w-xs">
                <Label htmlFor="slot" required>Select Slot</Label>
                <select
                  id="slot"
                  name="slot"
                  value={formData.slot}
                  onChange={(e) => setFormData((p) => ({ ...p, slot: e.target.value }))}
                  required
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm w-full focus:ring-2 focus:ring-teal-500"
                >
                  <option value="" disabled>
                    {slots.length ? "Choose a Time Slot" : "Enter employee ID to see slots"}
                  </option>
                  {slots.map((slot, i) => (
                    <option key={i} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-teal-600 text-white font-bold py-3 rounded-lg w-64 hover:bg-teal-700"
            >
              Check In
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
