const { query } = require("../config/db.config");

// Function to fetch time entry from the database by ID
async function getTimeById(timeId) {
  try {
    // Construct the SQL query to select time entry by ID
    const selectTimeSql = `
      SELECT *
      FROM apptlytime
      WHERE time_id = ?
    `;

    // Execute the SQL query to fetch the time entry by ID
    const time = await query(selectTimeSql, [timeId]);

    // Return the fetched time entry data
    return time[0]; // Assuming the result is an array, return the first element
  } catch (error) {
    // Throw an error if something goes wrong
    console.error("Error fetching time entry by ID:", error.message);
    throw new Error("Failed to fetch time entry by ID");
  }
}

// Function to update time entry in the database
async function updateTime(timeId, startTime, endTime) {
  try {
    // Construct the SQL query to update the time entry in the table
    const updateTimeSql = `
      UPDATE apptlytime
      SET
        start_time = ?,
        end_time = ?
      WHERE time_id = ?
    `;

    // Execute the SQL query to update the time entry
    const result = await query(updateTimeSql, [startTime, endTime, timeId]);

    // Check if any rows were affected (time entry updated successfully)
    return result.affectedRows > 0;
  } catch (error) {
    // Throw an error if something goes wrong
    console.error("Error updating time entry:", error.message);
    throw new Error("Failed to update time entry");
  }
}

module.exports = {
  getTimeById,
  updateTime,
};
