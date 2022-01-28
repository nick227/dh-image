var express = require("express");
var bodyParser = require('body-parser')
var fs = require("fs");
var port = process.env.PORT || 3000
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.listen(port, () => {});
app.get("/events", (req, res, next) => {
    const path = './dh-image-log.txt'
    res.json(read(path))
});
app.get("/reset", (req, res, next) => {
    const path = './dh-image-log.txt'
    fs.writeFile(path, '[]', { flag: 'w' }, function(err) {
        if (err) throw err;
        res.json(["ok"])
    });
});
app.post("/event", (req, res, next) => {
    save(req.body)
    res.json(["ok"])
});

function read(path) {
    return fs.readFileSync(path, 'utf8')
}

function save(data) {
    const path = './dh-image-log.txt'
    const cdata = JSON.parse(read(path))
    cdata.push(data)
    fs.writeFile(path, JSON.stringify(cdata), { flag: 'w' }, function(err) {
        if (err) throw err;
    });
}