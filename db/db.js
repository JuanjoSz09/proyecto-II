const mysql = require('mysql2/promise');

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

let pool;

const getConnection = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        timezone: 'Z',
      });
    }

    return await pool.getConnection();
  } catch (err) {
    console.error(err);
    throw new Error('problema de conexion con la base de datos');
  }
};

module.exports = {
  getConnection,
};
