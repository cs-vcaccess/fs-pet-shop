-- "migration" file
CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  age INT,
  kind VARCHAR(256),
  name VARCHAR(256)
)
