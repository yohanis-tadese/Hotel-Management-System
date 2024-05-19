const express = require("express");
const router = express.Router();
const timeController = require("../controller/time.controller");

// Define routes
router.get("/api/time/:id", timeController.getTimeById);
router.patch("/api/time/update/:id", timeController.updateTime);

module.exports = router;
