const timeService = require("../service/time.service");

async function getTimeById(req, res) {
  try {
    const { id } = req.params;
    const time = await timeService.getTimeById(id);
    if (!time) {
      return res.status(404).json({ error: "Time not found" });
    }
    res.status(200).json(time);
  } catch (error) {
    console.error("Error getting time by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateTime(req, res) {
  try {
    const { id } = req.params;
    const { start_time, end_time } = req.body;

    // Check if start_time and end_time are defined
    if (!start_time || !end_time) {
      return res
        .status(400)
        .json({ error: "Both start_time and end_time are required" });
    }

    const updatedTime = await timeService.updateTime(id, start_time, end_time);
    res.status(200).json(updatedTime);
  } catch (error) {
    console.error("Error updating time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getTimeById,
  updateTime,
};
