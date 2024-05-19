const express = require("express");
const companyController = require("../controller/company.controller");
const router = express.Router();

router.post("/api/company", companyController.createCompany);

router.get("/api/company/:id", companyController.getCompany);
router.get("/api/company", companyController.getAllCompaniesWithoutPagination);
router.get("/api/companies/page", companyController.getAllCompanies);

router.get("/api/company/:id/photo", companyController.getCompanyPhoto);

router.patch("/api/company/:id", companyController.updateCompany);

router.patch(
  "/api/company/profile/:id",
  companyController.updateCompanyPhoto,
  companyController.updateCompanyProfile
);

router.patch("/api/company/password/:id", companyController.changePassword);

router.delete("/api/company/:id", companyController.deleteCompany);

module.exports = router;
