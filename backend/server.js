const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

require("./jobs/resetAttendance");

const employeeAuthRoutes = require("./routes/auth/employeeAuth");
const User = require("./models/User");

const app = express();


app.use(cors({ origin: "*" }));
app.use(express.json());


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

app.get("/", (req, res) => {
  res.send("CRM Backend is Running ");
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await createAdmin();
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
  