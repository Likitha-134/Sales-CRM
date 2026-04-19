const cron = require("node-cron");
const User = require("../models/User");

// runs every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🔁 Midnight reset running...");

    await User.updateMany(
      {},
      {
        $set: {
          checkInTime: null,
          checkOutTime: null,
          breaks: [],
          isWorking: false
        }
      }
    );

    console.log("✅ Reset completed");

  } catch (err) {
    console.log("Cron error:", err);
  }
});