var port = process.env.PORT || 3000;
var express = require("express");
var path = require("path");
var app = express();
var request = require("request")
var bodyParser = require('body-parser')
var NounProject = require('the-noun-project');
var fs = require("fs");
const http = require('http');
const https = require('https');
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
    const log = path.join(__dirname, 'dh-image-log.txt')
    res.sendFile(log)
});
app.get("/reset", (req, res, next) => {
    const path = './dh-image-log.txt'
    fs.writeFile(path, '[]', { flag: 'w' }, function(err) {
        if (err) throw err;
        res.json(["ok"])
    });
});
app.post("/event", (req, res, next) => {
    save(req)
    res.json(["ok"])
});

function save(req) {
    const path = './dh-image-log.txt'
    const data = req.body
    const cdata = JSON.parse(read(path))
    data.ip = req.ip
    cdata.push(data)
    const val = JSON.stringify(cdata)
    fs.writeFile(path, val, { flag: 'w' }, function(err) {
        if (err) throw err;
    });
}

function read(path) {
    return fs.readFileSync(path, 'utf8')
}

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
app.get("/flatIcon", (req, res, next) => {
    const options = {
        url: 'https://api.flaticon.com/v2/app/authentication',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            apikey: '814f937125367cee6b1945e5d15b8035b1deb15a'
        })
    };

    request.post(options, (err, res2, body) => {
        if (err) {
            return console.log(err);
        }
        body = JSON.parse(body)
        if (body.hasOwnProperty('data') && body.data.hasOwnProperty('token')) {
            const token = body.data.token
            getFlatIcon(req.query, token, function(data) {
                res.json(data)
            })
        }
    });
});

function getFlatIcon(query, token, callback) {
    const options2 = {
        url: 'https://api.flaticon.com/v3/search/icons/priority',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: '?' + getParams(query)
    }
    request.get(options2, (err, res, body) => {
        if (err) {
            return console.log('2'+err);
        }
        callback(body)
    })
}
function getParams(params) {
  return Object.entries(params).map(entry => entry.join("=")).join("&");
}
