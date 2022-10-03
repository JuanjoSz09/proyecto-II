const bcrypt = require('bcrypt');
const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const getUserByEmail = async (email) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT * FROM users WHERE email = ?
    `,
      [email]
    );

    if (result.length === 0) {
      throw generateError('No existe ningún usuario con ese email', 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getUserById = async (id) => {
  let connection;
  //si no somos el dueño de este usuario no podemos visualizar la informacion del email//
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT email, username, created_at FROM users WHERE id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError('No existe ningún usuario con esa id', 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

//Anadir ademas de email y password el username//
const createUser = async (email, password, username) => {
  let connection;

  try {
    connection = await getConnection();

    const [user] = await connection.query(
      `
      SELECT id FROM users WHERE email = ?
    `,
      [email]
    );

    if (user.length > 0) {
      throw generateError('Ya existe una cuenta vinculada en ese email', 409);
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const [newUser] = await connection.query(
      `
      INSERT INTO users (email, password, username, created_at) VALUES(?, ?, ?, ?)
    `,
      [email, passwordHash, username, new Date()]
    );

    return newUser.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};
