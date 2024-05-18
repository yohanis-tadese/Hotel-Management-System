const express = require("express");
const sendResultsController = require("../controller/dept.results.controller");
const router = express.Router();

// Route to send results
router.post("/api/dept/send-results", sendResultsController.sendResults);

// Route to send results by department ID
router.get(
  "/api/dept/results/:departmentId",
  sendResultsController.getResultsByDepartmentId
);

router.get(
  "/api/dept/results/student/:studentId",
  sendResultsController.getResultsByStudentId
);

router.patch(
  "/api/results/dept/update/:studentId",
  sendResultsController.updateResultsByStudentId
);

module.exports = router;
