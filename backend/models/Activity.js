const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  type: { type: String }, 
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);