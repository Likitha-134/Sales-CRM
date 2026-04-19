const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const Lead = require("../models/Lead");
const User = require("../models/User");
const assignLead = require("../utils/assignLead");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), (req, res) => {
  const results = [];

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  let isValidHeaders = true;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("headers", (headers) => {
      const requiredHeaders = [
        "Name",
        "Email",
        "Source",
        "Date",
        "Location",
        "Language",
      ];

      const cleaned = headers.map((h) => h.trim());
      isValidHeaders = requiredHeaders.every((h) => cleaned.includes(h));

      if (!isValidHeaders) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          message: "Invalid CSV headers",
        });
      }
    })
    .on("data", (data) => {
      if (data.Name && data.Email) {
        results.push(data);
      }
    })
    .on("end", async () => {
      try {
        if (!isValidHeaders) return;

        for (const lead of results) {
          const assignedTo = await assignLead(lead.Language);

          await Lead.create({
            name: lead.Name,
            email: lead.Email,
            source: lead.Source,
            date: new Date(lead.Date),
            scheduledDate: lead.Date ? new Date(lead.Date) : new Date(),
            location: lead.Location,
            language: lead.Language,
            assignedTo,
          });
        }
        fs.unlinkSync(req.file.path);

        res.json({
          message: "CSV Uploaded Successfully",
          count: results.length,
        });
      } catch (err) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({ error: err.message });
      }
    });
});

router.get("/", async (req, res) => {
  try {
    const { assignedTo } = req.query;

    let query = {};

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const leads = await Lead.find(query).sort({ scheduledDate: 1 });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/manual", async (req, res) => {
  try {
    const { name, email, source, date, location, language, scheduledDate } =
      req.body;

    if (!name || !email || !language) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const assignedTo = await assignLead(language);

    const lead = await Lead.create({
      name,
      email,
      source,
      date,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(date),
      location,
      language,
      assignedTo,
    });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/close/:id", async (req, res) => {
  const logActivity = require("../utils/logActivity");
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (lead.status === "Closed") {
      return res.status(400).json({ message: "Already closed" });
    }

    await Lead.findByIdAndUpdate(req.params.id, {
      status: "Closed",
    });

    if (lead.assignedTo) {
      await User.findByIdAndUpdate(lead.assignedTo, {
        $inc: {
          closedLeads: 1,
        },
      });
    }

    res.json({ message: "Lead closed successfully" });
    await logActivity({
      userId: lead.assignedTo,
      leadId: lead._id,
      type: "closed",
      message: `Lead ${lead.name} marked as Closed`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/schedule/:id", async (req, res) => {
  try {
    const { scheduledDate, scheduleTime } = req.body;

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        scheduledDate,
        scheduleTime,
      },
      { new: true },
    );

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
