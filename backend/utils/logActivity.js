const Activity = require("../models/Activity");

const logActivity = async ({ userId, message, type, leadId }) => {
  try {
    await Activity.create({
      userId,
      message,
      type,
      leadId
    });
  } catch (err) {
    console.error("Activity Log Error:", err.message);
  }
};

module.exports = logActivity;