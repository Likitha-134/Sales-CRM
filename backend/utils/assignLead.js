const User = require("../models/User");
const logActivity = require("./logActivity");
const THRESHOLD = 3;

const assignLead = async (language) => {
  const users = await User.find({
    language,
    status: "Active",
    role: "Employee",
  }).sort({ assignedLeads: 1 });

  if (!users.length) return null;

  const eligible = users.filter((u) => u.assignedLeads < THRESHOLD);
  if (eligible.length === 0) {
    return null; 
  }

  const user = eligible[0];

  await User.findByIdAndUpdate(user._id, {
    $inc: { assignedLeads: 1 },
  });

  await logActivity({
    userId: user._id,
    type: "assigned",
    message: `New lead assigned: ${language} lead`,
  });

  return user._id;
};

module.exports = assignLead;
