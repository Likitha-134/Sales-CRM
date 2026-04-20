const router = require("express").Router();
const { employeeLogin } = require("../../controllers/employeeAuthController");
const user = await User.findOne({ email });
router.post("/employee-login", employeeLogin);
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
module.exports = router;
