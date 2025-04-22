const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const database = require("./js/database");

const app = express();
app.use(express.json());
app.use(cors());

database.createTable();

app.use("/", express.static(path.join(__dirname, "public")));

app.post("/insert", async (req, res) => {
    const viaggio = req.body.viaggio;
    try {
        await database.insert(viaggio);
        res.json({ result: "ok" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ result: "ko" });
    }
});

app.get("/viaggi", async (req, res) => {
    const list = await database.select();
    res.json(list);
    console.log("Server", list);
    
});

app.delete("/delete/:id", async (req, res) => {
    await database.delete(req.params.id);
    res.json({ result: "ok" });
   
});

const server = http.createServer(app);
const port = 5060;
server.listen(port, () => {
    console.log("- server running on port: " + port);
});
