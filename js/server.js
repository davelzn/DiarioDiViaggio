const express = require("express");
const http = require('http');
const path = require('path');
const cors = require('cors');
const app = express();
const database = require("./database");
app.use(express.json());
app.use(cors());
database.createTable();

app.use("/", express.static(path.join(__dirname, "public")));
app.post("/insert", async (req, res) => {
    const visit = req.body.visit;
    try {
        await database.insert(visit);
        res.json({ result: "ok" });
    } catch (e) {
        res.status(500).json({ result: "ko" });
    }
})
app.get('/visits', async (req, res) => {
    const list = await database.select();
    res.json(list);
    console.log("Server", list);
});
app.delete('/delete/:id', async (req, res) => {
    await database.delete(req.params.id);
    res.json({ result: "ok" });
})
const server = http.createServer(app);
const port = 5600;
server.listen(port, () => {
    console.log("- server running on port: " + port);
});