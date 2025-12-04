const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password, role, name, empId } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashed,
      role,
      name,
      empId, // optional if you want to assign manually
    });

    await newUser.save();

    res.json({ msg: "User Registered Successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Password mismatch");
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Include empId in JWT for dashboard queries
    const token = jwt.sign(
      { id: user._id, role: user.role, empId: user.empId, name: user.name },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1d" }
    );

    console.log("Login successful");

    res.json({
      msg: "Login Success",
      token,
      role: user.role,
      empId: user.empId,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
