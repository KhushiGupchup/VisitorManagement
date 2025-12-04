const mongoose = require("mongoose");
const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,

  photo: String, // Uploaded photo path

  purpose: { type: String, required: true },

  // Instead of host (ObjectId), use numeric Employee ID
  hostEmpId: { type: Number, required: true },

  status: { 
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  qrData: String,
  passPdf: String,

  scheduledAt: {
  type: String,
  required: true
}
,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Visitor", visitorSchema);
