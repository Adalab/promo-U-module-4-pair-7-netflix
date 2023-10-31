USE netflix;

SELECT * FROM movies;
SELECT title, genre FROM movies WHERE year >= 1990;
SELECT category FROM movies WHERE category IN ('Top 10');

UPDATE movies
SET year = 1997
WHERE title = 'La vita è bella';

SELECT * FROM actors;
SELECT birthday FROM actors WHERE birthday BETWEEN '1950-01-01' AND '1960-01-01';
SELECT name, lastname FROM actors WHERE country = 'Estados Unidos';

SELECT plan_details FROM users WHERE plan_details = 'Standard';
INSERT INTO users (user, password, name, email, plan_details)
VALUES ('emma_dev', 'emma', 'Emma', 'emma@gmail.com', 'Standard' );
DELETE FROM users WHERE name LIKE ('M%');

INSERT INTO actors (image)
VALUE ('https://hips.hearstapps.com/hmg-prod/images/tom-hanks1-1657264158.jpg');

ALTER TABLE actors ADD COLUMN image varchar(1000) AFTER birthday;
ALTER TABLE actors
DROP COLUMN image;

