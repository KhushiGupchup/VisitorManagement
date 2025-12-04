const Visitor = require("../models/Visitor");

exports.addVisitor = async (req, res) => {
  try {
    const visitorData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      hostEmpId: Number(req.body.hostEmpId), // map visitingTo from frontend
      purpose: req.body.purpose,             // map description from frontend
      scheduledAt: req.body.scheduledAt,     // map slot
      photo: req.file ? req.file.filename : null,
    };

    const newVisitor = await Visitor.create(visitorData);

    res.status(201).json({
      msg: "Visitor added successfully",
      data: newVisitor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
