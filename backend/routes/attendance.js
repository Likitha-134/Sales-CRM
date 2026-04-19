const router = require("express").Router();
const User = require("../models/User");
const Lead = require("../models/Lead");

const logActivity = require("../utils/logActivity");
/*check in*/
router.post("/checkin", async (req, res) => {
  const { email, time } = req.body;

  const user = await User.findOne({ email });

  await User.updateOne(
    { email },
    {
      $set: {
        checkInTime: time,
        isWorking: true,
      },
    },
  );

  await logActivity({
    userId: user._id,
    type: "attendance",
    message: `Checked In at ${time}`,
  });

  res.json({ message: "Checked In" });
});

/* CHECK OUT */
router.post("/checkout", async (req, res) => {
  const { email, time } = req.body;

  const user = await User.findOne({ email });

  await User.updateOne(
    { email },
    {
      $set: {
        checkOutTime: time,
        isWorking: false,
      },
    },
  );

  await logActivity({
    userId: user._id,
    type: "attendance",
    message: `Checked Out at ${time}`,
  });

  res.json({ message: "Checked Out" });
});

/* BREAK */
router.post("/break", async (req, res) => {
  try {
    const { email, time } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.breaks) user.breaks = [];

    const today = new Date().toLocaleDateString();

    const todayBreak = user.breaks.find((b) => b.date === today);

    if (!todayBreak) {
      await User.updateOne(
        { email },
        {
          $push: {
            breaks: {
              start: time,
              end: null,
              date: today,
            },
          },
        },
      );

      await logActivity({
        userId: user._id,
        type: "break",
        message: `Break Started at ${time}`,
      });

      return res.json({ message: "Break Started" });
    }

    if (todayBreak && !todayBreak.end) {
      todayBreak.end = time;
      await user.save();

      await logActivity({
        userId: user._id,
        type: "break",
        message: `Break Ended at ${time}`,
      });

      return res.json({ message: "Break Ended" });
    }

    return res.status(400).json({
      message: "Only one break allowed per day",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
