const express = require("express");
const studentController = require("../controller/student.controller");

const router = express.Router();

router.post("/api/student", studentController.createStudent);
router.get("/api/student", studentController.getAllStudents);
router.get("/api/students/byId/:studentId", studentController.getStudents);

router.delete("/api/student/:id", studentController.deleteStudent);
router.get("/api/student/types", studentController.getStudentTypes);
router.get(
  "/api/students/:departmentType",
  studentController.getStudentsByDepartment
);
router.post("/api/student/apply", studentController.acceptStudentApplyForm);

router.get(
  "/api/students/apply/list/:id",
  studentController.getApplyStudentsById
);
router.get("/api/students/apply/list", studentController.getAllApplyStudents);
router.delete(
  "/api/placement-result",
  studentController.deleteAllPlacementResults
);
router.patch(
  "/api/student/changepassword/:id",
  studentController.changePassword
);

router.patch(
  "/api/student/update/profile/:id",
  studentController.UplodeStudentPhoto,
  studentController.updateStudentProfile
);

router.patch("/api/student/update/:id", studentController.updateStudent);
router.patch(
  "/api/student/apply/update/:studentId",
  studentController.updateStudentApplyForm
);

router.get("/api/student/:id/photo", studentController.getStudentPhoto);

module.exports = router;
