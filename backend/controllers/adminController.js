const User = require("../models/User");
const Visitor = require("../models/Visitor");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

// Dashboard stats
exports.dashboard = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const totalVisitors = await Visitor.countDocuments();
    const pendingVisitors = await Visitor.countDocuments({ status: "pending" });

    res.json({ totalEmployees, totalVisitors, pendingVisitors });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error loading dashboard data" });
  }
};

// Add employee
// Add employee
exports.addEmployee = async (req, res) => {
  const { name, email, department, role } = req.body;

  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ msg: "Email already exists" });

    // Get last user with empId
    const lastUser = await User.findOne({
      empId: { $exists: true }
    }).sort({ empId: -1 }).select("empId");

    const nextEmpId = lastUser ? lastUser.empId + 1 : 1001;

    // Generate random password
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      department,
      role: role || "employee", // default
      empId: nextEmpId,
      password: hashedPassword
    });

    // Send login details via email
    await sendEmail(
      email,
      "Your Login Credentials",
      `
        <h2>Your Account Has Been Created</h2>
        <p><b>Employee ID:</b> ${nextEmpId}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Password:</b> ${password}</p>
        <p><b>Role:</b> ${role || "employee"}</p>
      `
    );

    res.json({
      msg: "Employee added successfully",
      user: newUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};



// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      empId: { $exists: true }   // fetch ALL employees & security
    }).select("-password");

    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get all visitors

exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });

    const formatted = visitors.map((v) => ({
      _id: v._id,
      name: v.name,
      email: v.email,
      phone: v.phone,
      host: v.visitingTo || "Not specified", // just show visitingTo
      status: v.status,
      scheduledAt: v.scheduledAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching visitors" });
  }
};


// Delete an employee and all related visitors
exports.deleteEmployee = async (req, res) => {
  try {
    const { empId } = req.params;

    // Find the employee
    const employee = await User.findOne({ empId: Number(empId) });
    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    // Delete all visitors associated with this employee (either host or visitingTo)
    await Visitor.deleteMany({
      $or: [
        { hostEmpId: Number(empId) },
        { visitingEmpId: Number(empId) } // optional, if you have this field
      ]
    });

    // Delete the employee
    await User.deleteOne({ empId: Number(empId) });

    res.json({ msg: "Employee and all related visitors deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting employee", error: err.message });
  }
};
