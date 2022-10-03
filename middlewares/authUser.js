const jwt = require('jsonwebtoken');
const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');

const authUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();
    const { authorization } = req.headers;

    if (!authorization) {
      throw generateError('Falta Authorization', 401);
    }

    let token;

    try {
      token = jwt.verify(authorization, process.env.SECRET);
    } catch {
      throw generateError('Token incorrecto', 401);
    }

    const [user] = await connection.query(
      `
    select * from users where id = ?
    `,
      [token.id]
    );

    if (user.length < 1) {
      throw generateError('Token no valido', 401);
    }

    req.userId = token.id;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
};
