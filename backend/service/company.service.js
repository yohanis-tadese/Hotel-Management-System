// Import necessary dependencies
const { query } = require("../config/db.config");
const bcrypt = require("bcrypt");

// Function to hash the password using bcrypt
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Function to check if the company exists in the database
async function checkIfCompanyExists(username) {
  const sql = "SELECT * FROM companies WHERE username = ?";
  const rows = await query(sql, [username]);
  return rows.length > 0;
}

// Function to create a new company
async function createCompany(company) {
  try {
    // Generate a unique username for the company
    const username = `comp_${company.company_name}`;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(company.password, 10);

    // Check if the company already exists
    const companyExists = await checkIfCompanyExists(username);
    if (companyExists) {
      throw new Error("Company already exists.");
    }

    // Insert company details into the companies table
    const insertCompanySql = `
        INSERT INTO companies (
          company_name,
          username,
          phone_number,
          contact_email,
          location,
          industry_sector,
          accepted_student_limit,
          password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
    const result = await query(insertCompanySql, [
      company.company_name,
      username,
      company.phone_number,
      company.contact_email,
      company.location,
      company.industry_sector,
      company.accepted_student_limit,
      hashedPassword,
    ]);
    const companyId = result.insertId;

    return companyId;
  } catch (error) {
    console.error("Error creating company:", error.message);
    throw new Error("Failed to create company");
  }
}

async function getCompany(companyId) {
  try {
    const sql = `
      SELECT * 
      FROM companies
      WHERE company_id = ?
    `;
    const [company] = await query(sql, [companyId]);
    return company;
  } catch (error) {
    throw new Error(`Error getting company: ${error.message}`);
  }
}

async function getAllCompanies() {
  try {
    const sql = `
      SELECT * 
      FROM companies
      ORDER BY company_id DESC
      LIMIT 10
    `;
    const rows = await query(sql);
    return rows;
  } catch (error) {
    throw new Error(`Error getting all companies: ${error.message}`);
  }
}

// Function to update an existing company
async function updateCompany(companyId, companyData) {
  try {
    const {
      company_name,
      phone_number,
      contact_email,
      location,
      industry_sector,
      accepted_student_limit,
      password,
    } = companyData;

    // Hash the password before updating
    const hashedPassword = await hashPassword(password);

    const username = `comp_${company_name}`;

    // Update the company data including the hashed password
    const updateSql = `
      UPDATE companies
      SET company_name = ?,
          username = ?,
          phone_number = ?,
          contact_email = ?,
          location = ?,
          industry_sector = ?,
          accepted_student_limit = ?,
          password = ?
      WHERE company_id = ?
    `;
    const result = await query(updateSql, [
      company_name,
      username,
      phone_number,
      contact_email,
      location,
      industry_sector,
      accepted_student_limit,
      hashedPassword, // Use hashedPassword instead of hashPassword
      companyId,
    ]);

    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error updating company: ${error.message}`);
  }
}

// Function to delete an existing company
async function deleteCompany(companyId) {
  try {
    // Check if companyId is undefined
    if (companyId === undefined) {
      throw new Error("Company ID is undefined");
    }

    const deleteSql = "DELETE FROM companies WHERE company_id = ?";
    const result = await query(deleteSql, [companyId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting company:", error.message);
    throw new Error("Failed to delete company");
  }
}

// Export the functions
module.exports = {
  checkIfCompanyExists,
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
};
