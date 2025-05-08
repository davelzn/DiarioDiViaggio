const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('./public/conf.json'));

conf.ssl = {
    ca: fs.readFileSync(__dirname + '/../ca.pem')
};

const connection = mysql.createConnection(conf);

const executeQuery = (sql, par = []) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, par, function (err, result) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log('Query eseguita');
                resolve(result);
            }
        });
    });
};

const database = {
    createTable: async () => {
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS utente (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(100) UNIQUE,
                password VARCHAR(100),
                email VARCHAR(255) UNIQUE
            )
        `);
        
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS viaggio (
                id_viaggio INT PRIMARY KEY AUTO_INCREMENT,
                titolo VARCHAR(100),
                descrizione TEXT,
                data_inizio DATE,
                data_fine DATE,
                id_utente INT,
                stato BOOLEAN,
                FOREIGN KEY (id_utente) REFERENCES utente(id)
            )
        `);
        
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS Tappa (
                id_tappa INT PRIMARY KEY AUTO_INCREMENT,
                titolo VARCHAR(100),
                descrizione TEXT,
                data DATE,
                id_viaggio INT,
                id_utente INT,
                FOREIGN KEY (id_viaggio) REFERENCES viaggio(id_viaggio),
                FOREIGN KEY (id_utente) REFERENCES utente(id)
            )
        `);
        //console.log('Tabelle create ✅');
    },

    registerUser: async (username, password, email) => {
        try {
            const user = await executeQuery(
                "SELECT * FROM utenti WHERE username = ? OR email = ?",
                [username, email]
            );

            if (user.length > 0) {
                return { exists: true };
            }

            await executeQuery(
                "INSERT INTO utenti (username, password, email) VALUES (?, ?, ?)",
                [username, password, email]
            );

            return { success: true };
        } catch (err) {
            console.error(err);
            return { error: true };
        }
    },

    loginUser: async (username, password) => {
        try {
            const user = await executeQuery(
                "SELECT * FROM utenti WHERE username = ? AND password = ?",
                [username, password]
            );

            if (user.length === 1) {
                return { success: true, user: user[0] };
            } else {
                return { success: false };
            }
        } catch (err) {
            console.error(err);
            return { error: true };
        }
    },

    insert: async (viaggio) => {
        let sql = `
            INSERT INTO viaggio (titolo, descrizione, data_inizio, data_fine, id_utente)
            VALUES (?, ?, ?, ?, ?)
        `;
        return await executeQuery(sql, [
            viaggio.titolo,
            viaggio.descrizione,
            viaggio.data_inizio,
            viaggio.data_fine,
            viaggio.id_utente
        ]);
    },

    select: () => {
        let sql = `
            SELECT id_viaggio, titolo, descrizione, data_inizio, data_fine, id_utente
            FROM viaggio
        `;
        return executeQuery(sql);
    },

    delete: (id) => {
        let sql = `
            DELETE FROM viaggio WHERE id_viaggio = ?
        `;
        return executeQuery(sql, [id]);
    },
    delete_tappa: (id) => {
        let sql = `
            DELETE FROM tappa WHERE id_tappa = ?
        `;
        return executeQuery(sql, [id]);
    }
};

module.exports = database;
