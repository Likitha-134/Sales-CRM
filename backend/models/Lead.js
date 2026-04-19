const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  source: String,
  date: Date,
  location: String,
  language: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "Ongoing" },

  type: String,
  scheduledDate: Date
  
}, { timestamps: true });
leadSchema.index({ language: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ status: 1 });

module.exports = mongoose.model("Lead", leadSchema);