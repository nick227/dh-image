var express = require("express");
var fs = require("fs");
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(3000, () => {});
app.get("/events", (req, res, next) => {
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"])
});

app.post("/event", (req, res, next) => {
    save(JSON.stringify(req.body))
    res.json(["ok"])
});


function read(path) {
    return fs.readFileSync(path)
}

function save(data) {
    const path = './dh-image-log.txt'
    const current = read(path)
    fs.writeFile(path, data, { flag: 'a' }, function(err) {
        if (err) throw err;
    });
}