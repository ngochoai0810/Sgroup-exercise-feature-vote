const pool = require("./db").pool;

const getOne = async ({ query, params }) => {
  const [rows] = await pool.promise().query(query, params);
  return rows[0];
};

const updateOne = async ({ query, params }) => {
  const [result] = await pool.promise().query(query, params);
  return result.affectedRows > 0;
};

module.exports = {
  getOne,
  updateOne,
};
