var port = process.env.PORT || 3000;
var express = require("express");
var path = require("path");
var app = express();
var request = require("request")
var https = require("https")
var bodyParser = require('body-parser')
var NounProject = require('the-noun-project');
var fs = require("fs");
const mysql = require('mysql');

const cors = require('cors');
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})
*/
app.listen(port, () => {
    console.log("Listening on port " + port)
});

/****************************************
 * DB
 ****************************************/

const db = {
    cx: {
        host: 'dcrhg4kh56j13bnu.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'zd6skoui21wh9q14',
        password: 'fvz871p26r5wghnk',
        database: 'eepab774vfog2vyw'
    },
    connect: function() {
        return mysql.createConnection(this.cx);
    },
    insert: async function(req, callback) {
        try {
            const conx = this.connect()
            const q = `INSERT INTO event (ip, data, type, timestamp) VALUES ("${req.ip}", "${escape(req.body.data)}", "${req.body.type}", "${req.body.date}" ) `
            await conx.query(q, function(err, res, fields) {
                if (err) { console.log(err) }
                callback(res)
            })
            conx.end()

        } catch (err) {
            console.log(err)
            callback(err)
        }
    },
    get: async function(callback) {
        try {
            const conx = this.connect()
            const q = 'SELECT * FROM event ORDER BY date DESC'
            await conx.query(q, function(err, res, fields) {
                callback(res)
            })

        } catch (err) {
            console.log(err)
            callback(err)
        }

    }
}


/****************************************
 * METRICS
 ****************************************/

app.get("/events", (req, res, next) => {
    db.get(function(data) {
        res.send(data)
    })
});
app.get("/reset", (req, res, next) => {
    const path = './dh-image-log.txt'
    fs.writeFile(path, '[]', { flag: 'w' }, function(err) {
        if (err) throw err;
        res.json(["ok"])
    });
});
app.post("/event", (req, res, next) => {
    db.insert(req, function(data) {
        res.send(data)
    })
});


/****************************************
 * APIS
 ****************************************/

//const ImgurClient = 'a13b61f8c0ddf4e'
//const ImgurSecret = 'bfcea682cd6b0011c6614e6b6a29a2caa1b4b339'
//const ImgurToken = '0e07fb290c65d3341e29f0f01c0553039b1deaf9'
//id: 317e151a0c260fd
//sec: f6f1dc43da9c84581da33f73f85ca3f1aff308b4

//noun project
app.get("/noun", (req, res, next) => {
    nounProject = new NounProject({
        key: '6fe5896299e4454da024e88e25d06dea',
        secret: 'a1106661e3e7492785bee89ca506519a'
    });
    nounProject.getIconsByTerm(req.query.term, { limit: req.query.limit }, function(err, data) {
        if (err) {
            res.send(err)
        }
        res.json(data)
    });
});

//flaticon
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
            res.send(err)
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
        url: 'https://api.flaticon.com/v3/search/icons/priority?' + getParams(query),
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        /*,
                body: '?' + getParams(query)*/
    }
    request.get(options2, (err, res, body) => {
        if (err) {
            return res.send(err);
        }
        callback(body)
    })
}

function getParams(params) {
    return Object.entries(params).map(entry => entry.join("=")).join("&");
}