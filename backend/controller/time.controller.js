const timeService = require("../services/time.service");

// Controller methods
async function createTime(req, res) {
  try {
    const { start_time, end_time } = req.body;
    const newTime = await timeService.createTime(start_time, end_time);
    res.status(201).json(newTime);
  } catch (error) {
    console.error("Error creating time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

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
    const updatedTime = await timeService.updateTime(id, start_time, end_time);
    res.status(200).json(updatedTime);
  } catch (error) {
    console.error("Error updating time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createTime,
  getTimeById,
  updateTime,
};
