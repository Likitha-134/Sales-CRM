const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    employeeId: String,
    language: String,
    password: String,

    assignedLeads: { type: Number, default: 0 },
    closedLeads: { type: Number, default: 0 },
    status: { type: String, default: "Active" },
    role: { type: String, enum: ["Admin", "Employee"], default: "Employee" },

    breaks: [
      {
        start: String,
        end: String,
        date: String,
      },
    ],

    activities: [
      {
        message: String,
        date: String,
      },
    ],

    checkInTime: String,
    checkOutTime: String,
    isWorking: Boolean,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
