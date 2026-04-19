const User = require("../models/User");
const jwt = require("jsonwebtoken");

const employeeLogin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
      role: "Employee"
    });

    if (!user) {
      return res.status(400).json({ message: "Employee not found" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { employeeLogin };