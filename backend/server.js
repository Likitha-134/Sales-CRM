const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("./jobs/resetAttendance");
const employeeAuthRoutes = require("./routes/auth/employeeAuth");

const app = express();

app.use(cors());
app.use(express.json());

const User = require("./models/User");

app.use("/api/auth", employeeAuthRoutes);
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/activity", require("./routes/activity"));

const createAdmin = async () => {
  const adminCount = await User.countDocuments({ role: "Admin" });

  if (adminCount === 0) {
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "Admin",
      language: "English",
    });

    console.log("Default Admin Created");
  }
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    await createAdmin();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(" Server running on", PORT));
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });
