const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('./public/conf2.json'));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
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
    insert: async (visit) => {
        let sql = `
    INSERT INTO visit(idType, date, hour, name)
    VALUES (?, ?, ?, ?)`;
        return await executeQuery(sql, [visit.idType, visit.date, visit.hour, visit.name]);
    },
    select: () =>{
        const sql = `
        SELECT id, idType, hour, date, name
        FROM visit`;
        return executeQuery(sql);
    },
    delete: (id) =>{
        let sql = `
        DELETE FROM visit WHERE id=$ID`;
        sql = sql.replace("$ID",id);
        return executeQuery(sql);
    },
    
}

module.exports = database;