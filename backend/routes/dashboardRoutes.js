const router = require("express").Router();
const Lead = require("../models/Lead");
const User = require("../models/User");

router.get("/stats", async (req, res) => {
  const unassignedLeads = await Lead.countDocuments({ assignedTo: null });
  const assignedThisWeek = await Lead.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
  });
  const activeSales = await User.countDocuments({
  assignedLeads: { $gt: 0 }
});

  const closed = await Lead.countDocuments({ status: "Closed" });
  const total = await Lead.countDocuments();

  const conversionRate = total ? ((closed / total) * 100).toFixed(1) : 0;

  res.json({ unassignedLeads, assignedThisWeek, activeSales, conversionRate });
});

router.get("/active-sales", async (req, res) => {
  const users = await User.find({
    assignedLeads: { $gt: 0 }
  });
  res.json(users);
});
router.get("/sales-graph", async (req, res) => {
  try {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 13);

    const leads = await Lead.find({
      createdAt: { $gte: start, $lte: today }
    });

  
    const map = {};

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() - (13 - i));

      const key = d.toISOString().slice(0, 10);

      map[key] = {
        date: key,
        rate: 0
      };
    }

    leads.forEach(l => {
      const key = l.createdAt.toISOString().slice(0, 10);
      if (map[key]) {
        map[key].rate += 1;
      }
    });

    res.json(Object.values(map));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Graph error" });
  }
});
router.get("/recent-activity", async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const activities = leads.map(l => ({
      text: `Lead ${l.status || "updated"} for ${l.name || "unknown"}`,
      time: l.createdAt
    }));

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Activity error" });
  }
});
module.exports = router;