require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    connection = await getConnection();

    console.log('Borrando tablas existentes');
    await connection.query('DROP TABLE IF EXISTS votes');
    await connection.query('DROP TABLE IF EXISTS links');
    await connection.query('DROP TABLE IF EXISTS users');

    console.log('Creando tablas');

    await connection.query(`
      CREATE TABLE users (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        username VARCHAR(15) UNIQUE NOT NULL,
        created_at DATETIME NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE links (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(200) NOT NULL,
        url VARCHAR(100) NOT NULL,
        idUser INT UNSIGNED NOT NULL,
        FOREIGN KEY (idUser) REFERENCES users (id),
        created_at DATETIME NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE votes (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	      value CHAR(1) DEFAULT 1,
        idLink INT UNSIGNED NOT NULL,
        FOREIGN KEY (idLink) REFERENCES links (id),
        idUser INT UNSIGNED NOT NULL,
        FOREIGN KEY (idUser) REFERENCES users (id),
        created_at DATETIME NOT NULL,
        modified_at DATETIME
      );
    `);

    console.log('Tablas creadas');
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
