const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { response } = require('express');

// create and config server
const server = express();
server.use(cors());
server.use(express.json({ limit: '25mb' }));

const getConnection = async () => {
  const connection = await mysql.createConnection({
    host: 'sql.freedb.tech',
    database: 'freedb_BD_netflix',
    user: 'freedb_pair_programming_7',
    password: 'Djh$*e7mFm5bUq%',
  });
  connection.connect();
  return connection;
};

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// endpoints
server.get('/movies', async (req, res) => {
  const conn = await getConnection();
  const sql = 'SELECT * FROM movies';
  const [results, fields] = await conn.query(sql);
  res.json({
    success: true,
    movies: results,
  });
  conn.end();
});

// static server
// const staticServerPath = './web/public';
// server.use(express.static(staticServerPath));
