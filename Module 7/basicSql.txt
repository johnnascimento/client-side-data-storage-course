// How to create a table in SQL world

CREATE TABLE users (
    id INT,
    username VARCHAR(255),
    city VARCHAR(255)
);

// How to populate the recently created table

INSERT INTO users (id, username, city) VALUES ('123, 'John', 'Brazil') // Insert a row follwing the params in the order hereby defined
INSERT INTO users (id, username, city) VALUES ('321, 'Barbara', 'Brazil') // Insert a row follwing the params in the order hereby defined
INSERT INTO users (id, username, city) VALUES ('213, 'Alana', 'Brazil') // Insert a row follwing the params in the order hereby defined

|-------------------------|
| id  | username |  city  |
|-----|----------|--------|
| 123 |   John   | Brazil |
|-----|----------|--------|
| 321 |  Barbara | Brazil |
|-----|----------|--------|
| 213 |  Alana   | Brazil |
|-------------------------|

// Selecting data from table

SELECT id, username, city FROM users // Selecting 3 columns from the table
SELECT username FROM users // Select only username column from the table
SELECT * FROM users // All columns using wild card

// Retriveing data from a specific place from the table 

SELECT * FROM users WHERE id = 12 // Returns only row matching the id 12 within this table

// Updating data in the table

UPDATE users SET city='Amsterdam'; // Update all columns within users' table
UPDATE users SET city='Istanbul' WHERE id=12 // Will update conditionally the city where the id matches 12 within the table

// Removing item from table

DELETE FROM users // All the data will be removed
DELETE FROM users WHERE id=12 // Delte only the row where id matches 12

