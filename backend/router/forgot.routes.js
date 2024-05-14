const express = require("express");
const router = express.Router();
const forgetController = require("../controller/forgot.controller");

router.post("/api/forgot-password", forgetController.forgotPassword);
router.patch("/api/reset-password/:token", forgetController.resetPassword);

module.exports = router;
