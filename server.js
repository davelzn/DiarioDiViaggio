const express = require("express");
const http = require("http");
const session = require('express-session');
const crypto = require("crypto");
const path = require("path");
const cors = require("cors");
const multer = require('multer');
const mailer = require("./js/mailer.js")
const database = require("./js/database");
const app = express();

database.createTable_viaggio();
database.createTable_utente()
database.createTable_preferiti();
database.createTable_tappa();
app.use(express.json());

app.use(cors());

app.use('/js', express.static('js'));

app.use("/", express.static(path.join(__dirname, "public")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

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

app.post("/insert/tappa", upload.single("immagine"), async (req, res) => {
  const { titolo, descrizione, data, id_viaggio } = req.body;
  const immagine = "/uploads/" + req.file.filename;

  const tappa = { titolo, descrizione, data, immagine, id_viaggio };

  try {
    await database.add_tappa(tappa);
    res.json({ result: "ok" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ result: "error" });
  }
});


app.post("/insert/preferito", async (req, res) => {
    const preferito = req.body.preferito;
    try {
        await database.insert_preferito(preferito);
        res.json({ result: "ok" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ result: "ok" })
    }
});
app.post("/insert/utente", async (req, res) => {
    const utente = req.body.utente;
    try {
        await database.insert_utente(utente);
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
app.delete("/delete/tappa/:id", async (req, res) => {
    await database.delete_tappa(req.params.id);
    res.json({ result: "ok" });
   
});
app.delete("/delete/preferito/:id_utente/:id_viaggio", async (req, res) => {
    const { id_utente, id_viaggio } = req.params;
    await database.delete_preferiti(id_utente, id_viaggio);
    res.json({ result: "ok" });
});
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username e password obbligatori." });
    }

    try {
        const user = await database.filtraLog(username, password);
        if (user) {
            console.log(user, " loggato")
            res.json({ success: true, user });
        } else {
            res.json({ success: false, message: "Credenziali non valide." });
        }
    } catch (e) {
        console.error("Errore durante il login:", e);
        res.status(500).json({ success: false, message: "Errore del server." });
    }
});

app.post("/utente", async (req, res) => {
    console.log(req.body);
    const { username, email } = req.body;
    console.log(username)

    if (!username || !email) {
        return res.status(400).json({ error: "username ed email obbligatori." });
    }

    const password = crypto.randomUUID().split('-')[0]; 

    try {
        await mailer.send(email, "La tua password di accesso", `La tua password è: ${password}`);
        await database.insert_utente({ username, email, password });

        res.json({ result: "ok" });
    } catch (e) {
        console.error("Errore nella registrazione:", e);
        res.status(500).json({ error: e.message || "Registrazione fallita" });
    }
});

const server = http.createServer(app);
const port = 5600;
server.listen(port, () => {
    console.log("- server running on port: " + port);
});

