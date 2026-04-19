const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.put("/update", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { userId, firstName, lastName, email, password } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (firstName !== undefined || lastName !== undefined) {
      const currentName = user.name ? user.name.split(" ") : ["", ""];
      const fName = firstName ?? currentName[0];
      const lName = lastName ?? currentName.slice(1).join(" ");

      user.name = `${fName} ${lName}`.trim();
    }

  if (email && email.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
  const existingUser = await User.findOne({ email: email.trim().toLowerCase() });

  if (existingUser && existingUser._id.toString() !== userId) {
    return res.status(400).json({ message: "Email already exists" });
  }

  user.email = email.trim().toLowerCase();
}

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.json({
      message: "Updated successfully",
      user
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err); 
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;