const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');

const setVote = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();
    const idReqUser = req.userId;
    const { id } = req.params;
    const { vote } = req.body;

    if (vote < 1 || vote > 5) {
      throw generateError('Solo se admiten votos entre uno y cinco', 400);
    }
    //si existe el enlace

    await connection.query(
      `
    INSERT INTO votes (value, idLink, idUser, created_at ) VALUES (? , ?, ?, ?)
    `,
      [vote, id, idReqUser, new Date()]
    );

    res.send({
      status: 'okay',
      mensaje: 'voto registrado correctamente',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  setVote,
};
