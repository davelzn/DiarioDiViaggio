const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const mailer = require("./js/mailer.js")
const database = require("./js/database");
const app = express();

app.use(express.json());

app.use(cors());

database.createTable_viaggio();

app.use('/js', express.static('js'));

app.use("/", express.static(path.join(__dirname, "public")));

app.post('/api/login', (req, res) => {
    res.json({ success: true });
  });

app.post("/insert/viaggi", async (req, res) => {
    const viaggio = req.body.viaggio;
    try {
        await database.insert(viaggio);
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
})

app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: "❌ Dati mancanti" });
    }

    try {
        const result = await database.registerUser(username, password, email);
        
        if (result.exists) {
            return res.status(409).json({ message: "⚠️ Utente già esistente" });
        }

        await mailer.send(email, "Benvenuto su Nidamato! 🎉", `Ciao ${username}, grazie per esserti registrato!`);

        res.status(201).json({ message: "✅ Registrazione completata" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "❌ Errore server" });
    }
});


app.get("/viaggi", async (req, res) => {
    const list = await database.select();
    res.json(list);
    console.log("Server", list);
    
});

app.get("/tappe", async (req, res) => {
    const list = await database.select();
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

const server = http.createServer(app);
const port = 5600;
server.listen(port, () => {
    console.log("- server running on port: " + port);
});
