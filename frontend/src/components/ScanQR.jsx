import { useEffect, useState, useContext } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../utils/api.js";
import SidebarSecurity from "../components/SidebarSecurity";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ScanQR() {
  const [result, setResult] = useState("");
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);
    scanner.render(
      async (decodedText) => {
        setResult(decodedText);
        try {
          const res = await api.post("/security/scan", { qrPayload: decodedText });
          alert(res.data.msg);
        } catch (err) {
          alert(err.response?.data?.msg || "Error scanning QR");
        }
        scanner.clear();
      },
      (err) => console.log("Scanning...", err)
    );
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SidebarSecurity />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>

        <div id="qr-reader" className="w-full max-w-md mx-auto shadow rounded"></div>

        <div className="mt-4 bg-gray-100 p-3 rounded text-center">
          <strong>Result:</strong> {result || "No QR scanned yet"}
        </div>
      </div>
    </div>
  );
}
