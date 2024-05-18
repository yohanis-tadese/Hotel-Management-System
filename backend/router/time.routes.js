const express = require("express");
const router = express.Router();
const timeController = require("../controller/time.controller");

// Define routes
router.post("/api/time", timeController.createTime);
router.get("/api/time/:id", timeController.getTimeById);
router.patch("/api/time/:id", timeController.updateTime);

module.exports = router;
