const { query } = require("../config/db.config");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

function generateToken() {
  return crypto.randomBytes(20).toString("hex");
}

async function findByEmail(email) {
  const sql = `
    SELECT 'department' AS entity_type FROM departments WHERE contact_email = ?
    UNION
    SELECT 'company' AS entity_type FROM companies WHERE contact_email = ?
    UNION
    SELECT 'student' AS entity_type FROM students WHERE contact_email = ?
    UNION
    SELECT 'admin' AS entity_type FROM admins WHERE email = ?;
  `;
  const rows = await query(sql, [email, email, email, email]);
  return rows && rows.length ? rows[0].entity_type : null;
}

async function generateForgotTokenAndSendEmail(email) {
  try {
    // Fetch entity type based on email
    const entityType = await findByEmail(email);
    if (!entityType) {
      throw new Error("Email not found");
    }

    // Generate a unique token
    const token = generateToken();

    // Update the appropriate table with token and created_at timestamp
    let sqlUpdateToken;
    switch (entityType) {
      case "department":
        sqlUpdateToken = `UPDATE departments SET token = ?, created_at = CURRENT_TIMESTAMP WHERE contact_email = ?;`;
        break;
      case "company":
        sqlUpdateToken = `UPDATE companies SET token = ?, created_at = CURRENT_TIMESTAMP WHERE contact_email = ?;`;
        break;
      case "student":
        sqlUpdateToken = `UPDATE students SET token = ?, created_at = CURRENT_TIMESTAMP WHERE contact_email = ?;`;
        break;
      case "admin":
        sqlUpdateToken = `UPDATE admins SET token = ?, created_at = CURRENT_TIMESTAMP WHERE email = ?;`;
        break;
      default:
        throw new Error("Invalid entity type");
    }
    await query(sqlUpdateToken, [token, email]);

    const resetPasswordLink = `http://localhost:5173/reset-password/${token}`;
    const mailOptions = {
      from: "yohanistadese05@gmail.com",
      to: email,
      subject: "Reset Your Password",
      html: `
      <div
      style="
        font-family: Arial, sans-serif;
        text-align: center;
        width: 60%;
        margin: 5px auto;
        border: 2px solid #fdf;
        padding: 5px;
      "
    >
      <p
        style="
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
          font-family: Georgia, 'Times New Roman', Times, serif;
          line-height: 28px;
        "
      >
        You requested to reset your password. <br />
        Please click the button below to reset your password:
      </p>
      <a href="${resetPasswordLink}" style="cursor: pointer">
        <button
          style="
            background-color: #0b5ed7;
            color: white;
            border: none;
            border-radius: 7px;
            padding: 12px 24px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
          "
        >
          Reset Password
        </button>
      </a>
      <p style="font-size: 17px; margin-top: 20px">
        If you didn't request this, you can ignore this email.
      </p>
    </div>
          `,
    };

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Reset password email sent successfully");

    // Return success message
    return "Password reset instructions sent";
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to send reset password instructions");
  }
}

async function resetPasswordWithToken(token, newPassword) {
  try {
    // Find the email associated with the provided token
    const sqlEmail = `
      SELECT contact_email AS email, entity_type FROM (
        SELECT contact_email, 'department' AS entity_type FROM departments WHERE token = ?
        UNION
        SELECT contact_email, 'company' AS entity_type FROM companies WHERE token = ?
        UNION
        SELECT contact_email, 'student' AS entity_type FROM students WHERE token = ?
        UNION
        SELECT email, 'admin' AS entity_type FROM admins WHERE token = ?
      ) AS emails;
    `;
    const rows = await query(sqlEmail, [token, token, token, token]);
    if (!rows || rows.length === 0) {
      throw new Error("Email not found for the provided token");
    }

    const { email, entity_type: entityType } = rows[0];

    // Update the password based on the entity type
    switch (entityType) {
      case "department":
        // Update department password
        const hashedDepartmentPassword = await bcrypt.hash(newPassword, 10);
        await query(
          `UPDATE departments SET password = ?, token = NULL WHERE contact_email = ? AND token = ?;`,
          [hashedDepartmentPassword, email, token]
        );
        break;
      case "company":
        // Update company password
        const hashedCompanyPassword = await bcrypt.hash(newPassword, 10);
        await query(
          `UPDATE companies SET password = ?, token = NULL WHERE contact_email = ? AND token = ?;`,
          [hashedCompanyPassword, email, token]
        );
        break;
      case "student":
        // Update student password
        const hashedStudentPassword = await bcrypt.hash(newPassword, 10);
        await query(
          `UPDATE students SET password = ?, token = NULL WHERE contact_email = ? AND token = ?;`,
          [hashedStudentPassword, email, token]
        );
        break;
      case "admin":
        // Update admin password
        const hashedAdminPassword = await bcrypt.hash(newPassword, 10);
        await query(
          `UPDATE admins SET password = ?, token = NULL WHERE email = ? AND token = ?;`,
          [hashedAdminPassword, email, token]
        );
        break;
      default:
        throw new Error("Invalid entity type");
    }
  } catch (error) {
    console.error("Error resetting password with token:", error);
    throw new Error("Failed to reset password with token");
  }
}

module.exports = {
  generateForgotTokenAndSendEmail,
  resetPasswordWithToken,
  findByEmail,
};
