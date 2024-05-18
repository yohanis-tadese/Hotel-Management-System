const { query } = require("../../../db/connection");

// Service methods
exports.createTime = async (start_time, end_time) => {
  const sql = "INSERT INTO apptlytime (start_time, end_time) VALUES (?, ?)";
  const result = await query(sql, [start_time, end_time]);
  const newTimeId = result.insertId;
  return { time_id: newTimeId, start_time, end_time };
};

exports.getTimeById = async (id) => {
  const sql = "SELECT * FROM apptlytime WHERE time_id = ?";
  const result = await query(sql, [id]);
  return result[0];
};

exports.updateTime = async (id, start_time, end_time) => {
  const sql =
    "UPDATE apptlytime SET start_time = ?, end_time = ? WHERE time_id = ?";
  await query(sql, [start_time, end_time, id]);
  return { time_id: id, start_time, end_time };
};
