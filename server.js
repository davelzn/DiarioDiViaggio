const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const mailer = require("./js/mailer.js")
const database = require("./js/database");
const app = express();

database.createTable_viaggio();

app.use(express.json());

app.use(cors());

app.use('/js', express.static('js'));

app.use("/", express.static(path.join(__dirname, "public")));

app.post('/api/login', (req, res) => {
    res.json({ success: true });
  });

app.post("/insert/viaggio", async (req, res) => {
    const viaggio = req.body.viaggio;
    try {
        await database.insert_viaggio(viaggio);
        res.json({ result: "ok" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ result: "ok" });
    }
});

app.post("/insert/tappe", async (req, res) => {
    const tappa = req.body.tappa;
    try {
        await database.insert(tappa);
        res.json({ result: "ok" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ result: "ok" })
    }
});

app.post("/insert/preferiti", async (req, res) => {
    const preferito = req.body.preferito;
    try {
        await database.insert(preferito);
        res.json({ result: "ok" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ result: "ok" })
    }
});
app.post("/insert/utenti", async (req, res) => {
    const utente = req.body.preferito;
    try {
        await database.insert(utente);
        res.json({ result: "ok" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ result: "ok" })
    }
});


app.get("/viaggi", async (req, res) => {
    const list = await database.select_viaggi();
    res.json(list);
    console.log("Server", list);
    
});

app.get("/tappe", async (req, res) => {
    const list = await database.select_tappe();
    res.json(list);
    console.log("server", list)
})

app.get("/preferiti", async (req, res) => {
    const list = await database.select_preferiti();
    res.json(list);
    console.log("server", list)
})

app.get("/utenti", async (req, res) => {
    const list = await database.select_utenti();
    res.json(list);
    console.log("server", list)
})

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.delete("/delete/:id", async (req, res) => {
    await database.delete(req.params.id);
    res.json({ result: "ok" });
   
});
app.post("/utente", async (req, res) => {
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ error: "Nome ed email obbligatori." });
    }

    const password = crypto.randomUUID().split('-')[0]; 

    try {
        await mailer.send(email, "La tua password di accesso", `La tua password è: ${password}`);

        await database.insertUtente({ nome, email, password });

        res.json({ result: "ok" });
    } catch (e) {
        console.error("Errore nella registrazione:", e);
        res.status(500).json({ error: "Registrazione fallita" });
    }
});
const server = http.createServer(app);
const port = 5600;
server.listen(port, () => {
    console.log("- server running on port: " + port);
});
