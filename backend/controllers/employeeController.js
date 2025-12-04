const User = require("../models/User");
const Visitor = require("../models/Visitor");
const bcrypt = require("bcryptjs");
const generateQR = require("../utils/generateQR");
const generatePDF = require("../utils/generatePDF");
const sendEmail = require("../utils/sendEmail");
const path = require("path");

// -------------------- Dashboard --------------------
exports.dashboard = async (req, res) => {
  try {
    const myVisitors = await Visitor.countDocuments({ hostEmpId: Number(req.user.empId) });
    const pendingVisitors = await Visitor.countDocuments({ hostEmpId: Number(req.user.empId), status: "pending" });

    res.json({ myVisitors, pendingVisitors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error loading dashboard data" });
  }
};

// -------------------- Schedule Visitor --------------------
exports.scheduleVisitor = async (req, res) => {
  try {
    const { name, email, phone, purpose, scheduledAt } = req.body;
    const photo = req.file?.path;

    // 1️⃣ Create visitor record
    const visitor = await Visitor.create({
      name,
      email,
      phone,
      purpose,
      hostEmpId: Number(req.user.empId),
      photo,
      scheduledAt,
      status: "approved", // directly approved
    });

    // 2️⃣ Get host info
    const host = await User.findOne({ empId: req.user.empId });

    // 3️⃣ Generate QR code
    const qrData = await generateQR(JSON.stringify({ visitorId: visitor._id }));

    // 4️⃣ Generate PDF pass
    const pdfPath = path.join(__dirname, "../uploads/pdfPass", `${visitor._id}.pdf`);
    await generatePDF({ ...visitor._doc, hostName: host?.name }, qrData, pdfPath);

    // 5️⃣ Update visitor record
    visitor.qrData = qrData;
    visitor.passPdf = pdfPath;
    await visitor.save();

    // 6️⃣ Send visitor email with modern pass
    if (email) {
      const emailHTML = `
        <div style="max-width:400px;margin:0 auto;font-family:sans-serif;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
          <div style="background:#3b82f6;color:white;text-align:center;padding:16px;font-size:20px;font-weight:bold;">
            VPMS Visitor Pass
          </div>
          <div style="padding:16px;text-align:center;">
            <div style="width:120px;height:120px;margin:0 auto;border-radius:8px;overflow:hidden;border:1px solid #ddd;">
              <img src="cid:visitor_photo" alt="Photo" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <div style="margin-top:16px;">
              <img src="cid:visitor_qr" alt="QR Code" style="width:180px;height:180px;" />
            </div>
            <div style="margin-top:16px;text-align:left;">
              <p><strong>Name:</strong> ${visitor.name}</p>
              <p><strong>Host:</strong> ${host?.name}</p>
              <p><strong>Status:</strong> ${visitor.status}</p>
              <p><strong>Scheduled At:</strong> ${new Date(visitor.scheduledAt).toLocaleString()}</p>
            </div>
          </div>
          <div style="background:#10b981;color:white;text-align:center;padding:12px;font-size:14px;">
            Please show this pass at the entrance.
          </div>
        </div>
      `;

      await sendEmail(email, "Your VPMS Visitor Pass", emailHTML, [
        {
          filename: "VisitorPass.pdf",
          path: pdfPath,
        },
        {
          filename: "qrcode.png",
          content: Buffer.from(qrData.split(",")[1], "base64"),
          cid: "visitor_qr",
        },
        ...(visitor.photo ? [{
          filename: "visitor_photo.jpg",
          path: visitor.photo,
          cid: "visitor_photo",
        }] : []),
      ]);
    }

    res.json({ msg: "Visitor scheduled successfully, email sent!", visitor });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error scheduling visitor", error: err.message });
  }
};

// -------------------- Get Employee Visitors --------------------
exports.getMyVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ hostEmpId: Number(req.user.empId) }).sort({ createdAt: -1 });

    const formatted = await Promise.all(
      visitors.map(async (v) => {
        const host = await User.findOne({ empId: v.hostEmpId });
        return {
          _id: v._id,
          name: v.name,
          email: v.email,
          phone: v.phone,
          purpose: v.purpose,
          status: v.status,
          scheduledAt: v.scheduledAt,
          qrData: v.qrData,
          hostName: host?.name || "Unknown",
          hostEmpId: v.hostEmpId
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching your visitors" });
  }
};

// -------------------- Change Password --------------------
exports.changePassword = async (req, res) => {
  try {
    const { empId, email, newPassword, confirmPassword } = req.body;

    if (!empId || !email || !newPassword || !confirmPassword)
      return res.status(400).json({ msg: "All fields are required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ msg: "Passwords do not match" });

    const user = await User.findOne({ empId });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.email !== email) return res.status(400).json({ msg: "Email does not match" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ msg: "Password changed successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// -------------------- Delete Visitor --------------------
exports.deleteVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.status(404).json({ msg: "Visitor not found" });

    if (visitor.hostEmpId !== Number(req.user.empId) && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to delete this visitor" });
    }

    await Visitor.deleteOne({ _id: visitorId });

    res.json({ msg: "Visitor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting visitor", error: err.message });
  }
};
// approve
exports.approveVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.status(404).json({ msg: "Visitor not found" });

    visitor.status = "approved";
    await visitor.save();

    res.json({ msg: "Visitor approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
