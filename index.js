var port = process.env.PORT || 3000;
var app = express();
var express = require("express");
var bodyParser = require('body-parser')
var fs = require("fs");
var NounProject = require('the-noun-project');
//var appKey = '123456789'

app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})
app.listen(port, () => {
    console.log("Listening on port " + port)
});

/****************************************
 * METRICS
 ****************************************/
app.get("/events", (req, res, next) => {
    const path = './dh-image-log.txt'
    res.send(read(path))
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

/****************************************
 * APIS
 ****************************************/
app.get("/noun", (req, res, next) => {
    nounProject = new NounProject({
        key: '6fe5896299e4454da024e88e25d06dea',
        secret: 'a1106661e3e7492785bee89ca506519a'
    });
    nounProject.getIconsByTerm(req.query.term, { limit: req.query.limit }, function(err, data) {
        if (!err) {
            console.log(data.icons);
        }
        res.json(data)
    });
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