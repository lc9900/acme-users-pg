var sql = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (id SERIAL PRIMARY KEY,
    name TEXT DEFAULT NULL,
    manager INTEGER
    );

    INSERT INTO users (name, manager) VALUES ('Joe Smith', 0);
    INSERT INTO users (name, manager) VALUES ('Nick Young', 0);
    INSERT INTO users (name, manager) VALUES ('Michael Jordan', 1);
    INSERT INTO users (name, manager) VALUES ('Scottie Pippen', 0);
    INSERT INTO users (name, manager) VALUES ('Kobe Bryant', 1);
`;



module.exports = sql;
