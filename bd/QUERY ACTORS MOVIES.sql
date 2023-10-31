use freedb_BD_netflix;

CREATE TABLE `actors` (
  `idActor` int Primary key NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `country` varchar(45) NOT NULL,
  `birthday` date DEFAULT NULL
);


CREATE TABLE `movies` (
 `idMovies` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `genre` varchar(45) NOT NULL,
  `image` varchar(1000) NOT NULL,
  `category` varchar(45) NOT NULL,
  `year` int DEFAULT NULL
);

CREATE TABLE `users` (
 `idUser` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `plan_details` varchar(45) NOT NULL
);

ALTER TABLE rel_movies_users add foreign key (fk_idUser) references users (idUser);
ALTER TABLE rel_movies_users add foreign key (fk_idMovies) references movies (idMovies);

INSERT INTO rel_movies_users (fk_idUser, fk_idMovies)
values (1, 1), (1,2), (2,2);

ALTER TABLE rel_movies_users ADD COLUMN score INT;

ALTER TABLE rel_movies_users MODIFY score FLOAT;

ALTER TABLE rel_movies_actors add foreign key (fk_idActor) references actors (idActor);
ALTER TABLE rel_movies_actors add foreign key (fk_idMovies) references movies (idMovies);

INSERT INTO rel_movies_actors (fk_idActor, fk_idMovies)
values (1, 3), (2,2), (3,1);

ALTER TABLE actors ADD COLUMN image VARCHAR (1000);

