const { query } = require("../config/db.config");

async function saveResults(formData) {
  const {
    student_id,
    department_id,
    advisor_score,
    presentation_score,
    documentation_score,
  } = formData;

  // Insert the results into the database
  await query(
    "INSERT INTO evaluation_result (student_id, department_id, advisor_score, presentation_score, documentation_score) VALUES (?, ?, ?, ?, ?)",
    [
      student_id,
      department_id,
      advisor_score,
      presentation_score,
      documentation_score,
    ]
  );
}

async function getResultsByDepartmentId(departmentId) {
  const results = await query(
    `SELECT 
      students.first_name AS student_first_name, 
      students.last_name AS student_last_name, 
      departments.department_name,
      evaluation_result.*,
      student_organizational_result.commitment,
      student_organizational_result.courtesy,
      student_organizational_result.conduct,
      student_organizational_result.perseverance,
      student_organizational_result.teamwork,
      student_organizational_result.professional_ethics,
      student_organizational_result.creativity,
      student_organizational_result.technical_knowledge,
      student_organizational_result.efficiency,
      student_organizational_result.professional_comments,
      student_organizational_result.attendance
    FROM 
      evaluation_result 
    INNER JOIN 
      students ON evaluation_result.student_id = students.student_id 
    INNER JOIN 
      departments ON evaluation_result.department_id = departments.department_id 
    INNER JOIN 
      student_organizational_result ON evaluation_result.student_id = student_organizational_result.student_id
    WHERE 
      evaluation_result.department_id = ?`,
    [departmentId]
  );

  return results;
}

async function getResultsByStudentId(studentId) {
  const results = await query(
    `SELECT 
      students.first_name AS student_first_name, 
      students.last_name AS student_last_name, 
      departments.department_name,
      evaluation_result.*,
      student_organizational_result.commitment,
      student_organizational_result.courtesy,
      student_organizational_result.conduct,
      student_organizational_result.perseverance,
      student_organizational_result.teamwork,
      student_organizational_result.professional_ethics,
      student_organizational_result.creativity,
      student_organizational_result.technical_knowledge,
      student_organizational_result.efficiency,
      student_organizational_result.professional_comments,
      student_organizational_result.attendance
    FROM 
      evaluation_result 
    INNER JOIN 
      students ON evaluation_result.student_id = students.student_id 
    INNER JOIN 
      departments ON evaluation_result.department_id = departments.department_id 
    INNER JOIN 
      student_organizational_result ON evaluation_result.student_id = student_organizational_result.student_id
    WHERE 
      evaluation_result.student_id = ?`,
    [studentId]
  );

  return results;
}

async function updateResultsByStudentId(studentId, updateData) {
  const {
    student_id,
    department_id,
    advisor_score,
    presentation_score,
    documentation_score,
  } = updateData;

  await query(
    `UPDATE evaluation_result SET 
      student_id = ?,
      department_id = ?,
      advisor_score = ?,
      presentation_score = ?,
      documentation_score = ?
    WHERE student_id = ?`,
    [
      student_id,
      department_id,
      advisor_score,
      presentation_score,
      documentation_score,
      studentId,
    ]
  );
}

module.exports = {
  saveResults,
  getResultsByDepartmentId,
  getResultsByStudentId,
  updateResultsByStudentId,
};
