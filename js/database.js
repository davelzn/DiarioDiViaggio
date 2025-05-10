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
    createTable_utente: async () => {
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS utente (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(100) UNIQUE,
                password VARCHAR(100),
                email VARCHAR(255) UNIQUE
            )
        `);
    },

    insert_utente: async (utente) => {
        let sql = `
            INSERT INTO utente (id,username,password,email)
            VAlues (?,?,?,?)
        `;
        await executeQuery(sql,[
            utente.id,
            utente.username,
            utente.password,
            utente.email
        ]
            
        )
    },
    select_utenti: async () => {
        let sql = `
            SELECT id, username, password, email
            FROM utente
        `;
        try {
            const result = await executeQuery(sql); // Esegui la query
            console.log("Dati delgli utenti:", result);
            return result; // Restituisci i risultati
        } catch (err) {
            console.error("Errore nell'eseguire la query:", err); // Stampa l'errore
            throw new Error("Errore nel recupero degli utenti");
        }
    },

    createTable_viaggio: async () => {
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS viaggio (
                id_viaggio INT PRIMARY KEY AUTO_INCREMENT,
                titolo VARCHAR(100),
                descrizione TEXT,
                data_inizio VARCHAR(12),
                data_fine VARCHAR(12),
                id_utente INT,
                stato INT,
                FOREIGN KEY (id_utente) REFERENCES utente(id)
            )
        `);//stato finito se = 0
    },

    insert_viaggio: async (viaggio) => {
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

    select_viaggi: () => {
        let sql = `
            SELECT id_viaggio, titolo, descrizione, data_inizio, data_fine, id_utente
            FROM viaggio
        `;
        return executeQuery(sql);
    },

    createTable_tappa: async () => {
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS tappa (
                id_tappa INT PRIMARY KEY AUTO_INCREMENT,
                titolo VARCHAR(100),
                descrizione TEXT,
                data DATE,
                id_viaggio VARCHAR(20),
                id_utente INT,
                FOREIGN KEY (id_viaggio) REFERENCES viaggio(id_viaggio),
                FOREIGN KEY (id_utente) REFERENCES utente(id)
            )
        `);
    },

    insert_tappa : async (tappa) => {
        let sql =`
            INSERT INTO tappa (titolo, descrizione, data,id_viaggio, id_utente)
            VALUES (?,?,?,?,?)
        `;
        return await executeQuery(sql, [
            tappa.titolo,
            tappa.descrizione,
            tappa.data,
            tappa.id_viaggio,
            tappa.id_utente
        ]);
    },

    select_tappe: async () => {
        let sql = `
            SELECT id_tappa, titolo, descrizione, data, id_viaggio, id_utente
            FROM tappa
        `;
        try {
            const result = await executeQuery(sql); // Esegui la query
            console.log("Dati delle tappe:", result);
            return result; // Restituisci i risultati
        } catch (err) {
            console.error("Errore nell'eseguire la query:", err); // Stampa l'errore
            throw new Error("Errore nel recupero delle tappe");
        }
    },


    createTable_preferiti: async () => {
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS preferito (
                id_utente INT,
                id_viaggio INT,
                PRIMARY KEY (id_utente, id_viaggio),
                FOREIGN KEY (id_viaggio) REFERENCES viaggio(id_viaggio),
                FOREIGN KEY (id_utente) REFERENCES utente(id)
)
        `)
        //console.log('Tabelle create ✅');
    },

    insert_preferiti : async (preferito) => {
        let sql =`
            INSERT INTO preferito (id_utente,id_viaggio)
            VALUES (?,?)
        `;
        return await executeQuery(sql, [
            preferito.id_utente,
            preferito.id_viaggio
        ]);
    },
    select_preferiti: async () => {
        let sql = `
            SELECT id_viaggio, id_utente
            FROM preferito
        `;
        try {
            const result = await executeQuery(sql); // Esegui la query
            console.log("Dati dei preferiti:", result);
            return result; // Restituisci i risultati
        } catch (err) {
            console.error("Errore nell'eseguire la query:", err); // Stampa l'errore
            throw new Error("Errore nel recupero dei preferiti");
        }
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
    },
    delete_preferiti : (id_utente,id_viaggio) => {
        let sql = `
            DELETE FROM preferito 
            WHERE id_utente = ? AND id_viaggio = ?
        `
        return executeQuery(sql, [id_utente,id_viaggio])
    }
};

module.exports = database;
