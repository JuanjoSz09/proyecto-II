const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const deteleLinkById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
      DELETE FROM links WHERE id = ?
    `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};

const getLinkById = async (idLink) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT * FROM links WHERE id = ?
    `,
      [idLink]
    );

    if (result.length === 0) {
      throw generateError(`El link con id: ${idLink} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getAllLinks = async () => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(`
      SELECT * FROM links ORDER BY created_at DESC
    `);

    return result;
  } finally {
    if (connection) connection.release();
  }
};

const createLink = async (title, description, url, idUser) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      INSERT INTO links ( title, description, url, idUser, created_at )
      VALUES(?,?,?,?,?)
    `,
      [title, description, url, idUser, new Date()]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createLink,
  getAllLinks,
  getLinkById,
  deteleLinkById,
};
