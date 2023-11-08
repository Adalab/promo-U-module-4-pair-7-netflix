const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

//endpoint para detalle
server.get('/movie/:movieID', async (req, res) => {
  const conn = await getConnection(); //conexión
  console.log(req.params.movieID);
  const foundMovie = 'SELECT * FROM movies WHERE idMovies = ?'; //petición o consulta
  const [results] = await conn.query(foundMovie, [req.params.movieID]); //ejecutamos consulta y enlazamos con url params
  console.log(results);
  res.render('pages/movie', { movie: results[0] });
  conn.end();
});

//endpoint sing-up
server.post('/sign-up', async (req, res) => {
  const userName = req.body.userName;
  const userEmail = req.body.userEmail;
  const userPassword = req.body.userPassword;
  const passwordHash = await bcrypt.hash(userPassword, 10);
  const conn = await getConnection();
  const sql = 'INSERT INTO users (user,password, email) VALUES (?,?,?)';
  jwt.sign(userPassword, 'secret_key', async (err, token) => {
    if (err) {
      res.status(400).send({ msg: 'Error' });
    } else {
      const conn = await getConnection();
      const [results] = await conn.query(sql, [
        userName,
        userEmail,
        passwordHash,
      ]);
      conn.end();
      //Si todo sale bien, se envía una respuesta JSON con un mensaje de éxito, el token JWT y el insertId,
      //que es el ID del usuario recién insertado en la base de datos.
      res.json({
        success: true,
        userId: 'nuevo-id-añadido',
      });
    }
  });
});

//endpoint login
server.post('/login', async (req, res) => {
  //recibe el cuerpo de la solicitud, que debería contener el nombre de usuario y la contraseña.
  const body = req.body;

  //Buscar si el usuario existe en la bases de datos
  const sql = 'SELECT * FROM users WHERE username= ?';
  const connection = await getConnection();
  const [users] = await connection.query(sql, [body.username]);
  connection.end();

  const user = users[0];

  //Comprueba si el usuario existe y si la contraseña proporcionada es correcta utilizando bcrypt.compare.
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  //Si el usuario no existe o la contraseña es incorrecta, responde con un estado 401 y un mensaje de error.
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Credenciales inválidas',
    });
  }

  //Si las credenciales son correctas, se prepara un objeto userForToken que incluye el username y el id del usuario.
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  //Crear el token para enviar al front
  const token = generateToken(userForToken);

  //Finalmente, si todo es correcto, la función responde con un estado 200 y envía un objeto JSON con el token, el nombre de usuario y el nombre real del usuario.
  response
    .status(200)
    .json({ token, username: user.username, name: user.name });
});

//generar token, verificar token & middleware
const generateToken = (payload) => {
  const token = jwt.sign(payload, 'secreto', { expiresIn: '1h' });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, 'secreto');
    return decoded;
  } catch (err) {
    return null;
  }
};

// static server
const staticServerPath = './src/public-react';
server.use(express.static(staticServerPath));

//static server CSS
const pathServerPublicStyles = './src/public-css';
server.use(express.static(pathServerPublicStyles));
