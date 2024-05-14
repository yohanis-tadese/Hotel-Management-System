// Import necessary dependencies
const multer = require("multer");
const companyService = require("../service/company.service");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/company");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.params.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const updateCompanyPhoto = upload.single("photo");

async function createCompany(req, res, next) {
  try {
    // Generate the username automatically
    const username = `comp.${req.body.company_name.toLowerCase()}`;

    // Check if company name already exists
    const companyExists = await companyService.checkIfCompanyExists(username);

    if (companyExists) {
      return res.status(400).json({
        error: "This company name already exists!",
      });
    }

    // Create new company
    const companyId = await companyService.createCompany({
      company_name: req.body.company_name,
      phone_number: req.body.phone_number,
      contact_email: req.body.contact_email,
      location: req.body.location,
      industry_sector: req.body.industry_sector,
      accepted_student_limit: req.body.accepted_student_limit,
      website: req.body.website,
      photo: req.body.photo,
      password: req.body.password,
    });

    // Return success response
    return res.status(200).json({
      status: true,
      message: "Company created successfully",
      companyId,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function getCompany(req, res, next) {
  try {
    const companyId = req.params.id;
    const company = await companyService.getCompany(companyId);

    if (!company) {
      return res.status(404).json({
        error: "Company not found",
      });
    }

    return res.status(200).json({
      status: true,
      company,
    });
  } catch (error) {
    console.error("Error getting company:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function getAllCompaniesWithoutPagination(req, res, next) {
  try {
    // Call the service function to fetch all companies
    const companies = await companyService.getAllCompaniesWithoutPagination();

    // Calculate total count of companies
    const totalCount = companies.length;

    res.json({
      companies,
      totalCount,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getAllCompanies = async (req, res) => {
  try {
    // Extract page number and page size from query parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = req.query.size ? parseInt(req.query.size) : 5;

    // Call the service function to fetch companies with pagination
    const companies = await companyService.getAllCompanies(page, size);

    // Calculate total count of companies
    const totalCount = await companyService.getCompanyCount();

    // Calculate total pages based on total count and page size
    const totalPages = Math.ceil(totalCount / size);

    res.json({
      companies,
      totalCount,
      totalPages,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function updateCompany(req, res, next) {
  try {
    const companyId = req.params.id;
    const updatedCompany = await companyService.updateCompany(
      companyId,
      req.body
    );

    if (!updatedCompany) {
      return res.status(404).json({
        error: "Company not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function updateCompanyProfile(req, res, next) {
  try {
    // Extract admin ID from request parameters
    const companyId = req.params.id;

    // Check if a file was uploaded
    let photoFilename = null;
    if (req.file) {
      photoFilename = req.file.filename;
    }

    // Call the service to update the admin
    const success = await companyService.updateCompanyProfile(
      companyId,
      req.body,
      photoFilename
    );

    // Check if the admin was successfully updated
    if (success) {
      const company = await companyService.getCompany(companyId);
      return res.status(200).json({
        status: true,
        company,
      });
    } else {
      // If update failed, return an error response
      return res.status(404).json({
        status: false,
        error: "Company not found",
      });
    }
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function deleteCompany(req, res, next) {
  try {
    const companyId = req.params.id;
    const deleted = await companyService.deleteCompany(companyId);

    if (!deleted) {
      return res.status(404).json({
        error: "Company not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function getCompanyPhoto(req, res, next) {
  try {
    // Extract admin ID from request parameters
    const companyId = req.params.id;

    // Call the service function to get the admin photo filename
    const photoFilename = await companyService.getCompanyPhoto(companyId);

    // If photo filename is not found or empty, send a 404 response
    if (!photoFilename) {
      return res.status(404).json({
        status: false,
        error: "Company photo not found",
      });
    }

    // Construct the photo URL based on the photo filename
    const photoUrl = `/public/images/company/${photoFilename}`;

    // Send the photo URL in the response
    return res.status(200).json({
      status: true,
      photoUrl,
    });
  } catch (error) {
    console.error("Error getting company photo:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

const changePassword = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check if the new password matches the confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "New password and confirm password do not match.",
      });
    }

    // Call the service method to change the password
    const response = await companyService.changePassword(
      companyId,
      oldPassword,
      newPassword,
      confirmPassword
    );

    if (response) {
      return res.status(200).json({
        status: "success",
        message: "Password updated successfully",
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Failed to update password. The old password is incorrect.",
      });
    }
  } catch (error) {
    if (error.message === "Old password is incorrect") {
      return res.status(402).json({
        status: "fail",
        message: "Failed to update password. The old password is incorrect.",
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Failed to update password. Please try again later.",
      });
    }
  }
};

module.exports = {
  createCompany,

  getAllCompanies,
  getAllCompaniesWithoutPagination,
  getCompany,
  getCompanyPhoto,

  updateCompany,
  updateCompanyProfile,
  changePassword,

  updateCompanyPhoto,
  deleteCompany,
};
