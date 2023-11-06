const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// create and config server
const server = express();
server.use(cors());
server.use(express.json({ limit: '25mb' }));
server.set('view engine', 'ejs');

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
  const genreFilterParam = req.query.genre;
  const sortFilterParam = req.query.sort;
  if (genreFilterParam) {
    const sqlGenre = `SELECT * FROM freedb_BD_netflix.movies WHERE genre="${genreFilterParam}"`;
    const [results] = await conn.query(sqlGenre);
    console.log('He recibido el género');
    res.json({
      success: true,
      movies: results,
      genre: results,
    });
  } else if (sortFilterParam) {
    const sqlSort = `SELECT * FROM freedb_BD_netflix.movies ORDER BY title ${sortFilterParam}`;
    const [results] = await conn.query(sqlSort);
    res.json({
      success: true,
      movies: results,
      title: results,
    });
  } else {
    const sql = 'SELECT * FROM movies';
    const [results] = await conn.query(sql);
    console.log('No he recibido el género');
    res.json({
      success: true,
      movies: results,
      genre: results,
    });
  }

  conn.end();
});

// static server
// const staticServerPath = './web/public';
// server.use(express.static(staticServerPath));

//endpoint para detalle
server.get('/movie/:movieID', async (req, res) => {
  const conn = await getConnection(); //conexión
  console.log(req.params.movieID);
  const foundMovie = 'SELECT * FROM movies WHERE idMovies = ?'; //petición o consulta
  const [results] = await conn.query(foundMovie, [req.params.movieID]); //ejecutamos consulta y enlazamos con url params
  console.log(results);
  res.render('pages/movie', foundMovie);
});
