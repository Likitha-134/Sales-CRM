const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");


router.post("/employee-login", async (req, res) => {
  try {
    const { email, password } = req.body;

  
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user,
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
