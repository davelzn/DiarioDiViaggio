const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('./public/conf.json'));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/../ca.pem')
}
const connection = mysql.createConnection(conf);

const executeQuery = (sql,par = []) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, par, function (err, result) {
           if (err) {
              console.error(err);
              reject();
           }
           console.log('done');
           resolve(result);
        });
    })
}

const database = {
    init: (name) => {
        let sql = `INSERT INTO type (name) VALUES (${name})`;
        return executeQuery(sql);
    },

    createTable: async () => {
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS viaggio (
                id_viaggio INT PRIMARY KEY AUTO_INCREMENT,
                titolo VARCHAR(100),
                descrizione TEXT,
                data_inizio DATE,
                data_fine DATE,
                id_utente INT
            )
        `);
        console.log('done');
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
            DELETE FROM viaggio WHERE id_viaggio = $ID
        `;
        sql = sql.replace("$ID", id);
        return executeQuery(sql);
    }
    
}

module.exports = database;