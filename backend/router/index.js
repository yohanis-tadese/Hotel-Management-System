const express = require("express");
const router = express.Router();

const installRouter = require("./install.routes");
const studentRouter = require("./student.routes");
const adminRouter = require("./admin.routes");
const companyRouter = require("./company.routes");
const departmentRouter = require("./department.routes");
const loginRouter = require("./login.routes");
const criteriaRouter = require("./criteria.routes");
const placementRouter = require("./placement.routes");
const resultRouter = require("./result.routes");
const forgotRouter = require("./forgot.routes");
const deptResultRouter = require("./time.routes");
const time = require("./dept.result.routes");

router.use(installRouter);
router.use(studentRouter);
router.use(adminRouter);
router.use(companyRouter);
router.use(departmentRouter);
router.use(loginRouter);
router.use(criteriaRouter);
router.use(placementRouter);
router.use(resultRouter);
router.use(forgotRouter);
router.use(deptResultRouter);
router.use(time);

module.exports = router;
