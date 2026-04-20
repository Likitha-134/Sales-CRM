const router = require("express").Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

   
    if (email) {
      const user = await User.findOne({ email });
      return res.json(user);
    }

    const users = await User.find.sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const existing = await User.findOne({ email: req.body.email });

    if (existing) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const user = await User.create({
      ...req.body,
      status: req.body.status || "Active",
    });

    res.status(201).json(user); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/delete-many", async (req, res) => {
  try {
    await User.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
