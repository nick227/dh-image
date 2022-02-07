const port = process.env.PORT || 3000;
const express = require("express");
const path = require("path");
const app = express();
const request = require("request")
const https = require("https")
const async = require('async')
const bodyParser = require('body-parser')
const NounProject = require('the-noun-project');
const fs = require("fs");
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
            const q = generateQuery(req)
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
    get: function(callback, key, req) {
        const queries = {
            recent: async function() {
                const q = `SELECT *, count(term) AS termCount, count(thumb) AS thumbCount FROM event WHERE ip = "${req.ip}" GROUP BY term, thumb ORDER BY timestamp DESC LIMIT 5`
                console.log(q)
                doSelect(q, callback)
            },
            trending: async function() {
                const results = []
                const qs = ['SELECT thumb, term, full FROM event WHERE type="image" GROUP BY thumb ORDER BY timestamp DESC LIMIT 6',
                    'SELECT term, COUNT(term) as count from event WHERE type="search" GROUP BY term ORDER BY timestamp DESC LIMIT 5',
                    'SELECT thumb, term, full, COUNT(thumb) as count FROM event WHERE type="image" GROUP BY thumb ORDER BY count DESC LIMIT 6',
                    'SELECT term, COUNT(term) as count from event WHERE type="search" GROUP BY term ORDER BY count DESC LIMIT 5'
                ]
                const keys = [
                    ['recent', 'images'],
                    ['recent', 'terms'],
                    ['top', 'images'],
                    ['top', 'terms']
                ]
                const resObj = {
                    recent: {
                        images: [],
                        terms: []
                    },
                    top: {
                        images: [],
                        terms: []
                    }
                }
                const fns = []
                for (var i = 0, length1 = qs.length; i < length1; i++) {
                    makeRequest(qs[i], i)
                }

                function makeRequest(q, counter) {
                    fns.push(function(next) {
                        doSelect(q, function(data) {
                            //resObj[keys[counter][0]][keys[counter][1]] = data
                            results.push(data)
                            next()
                        })
                    })
                }
                async.series(fns).then(function() {
                    resObj.recent.images = results[0]
                    resObj.recent.terms = results[1]
                    resObj.top.images = results[2]
                    resObj.top.terms = results[3]
                    callback(resObj)
                })
            }
        }
        if (!queries[key]) {
            doSelect('SELECT * FROM event ORDER BY timestamp DESC LIMIT 5', callback)
        } else {
            queries[key]()
        }

    }
}

function doSelect(q, callback) {
    try {
        const conx = db.connect()
        conx.query(q, function(err, res, fields) {
            callback(res)
        })
        conx.end()
    } catch (err) {
        console.log(err)
        callback(err)
    }
}

function generateQuery(req) {
    const keys = Object.keys(req.body)
    const vals = Object.values(req.body)
    return 'INSERT INTO event (ip, ' + keys.join(', ') + ') VALUES ("' + req.ip + '", "' + vals.join('", "') + '")'
}

/****************************************
 * METRICS
 ****************************************/

app.post("/event", (req, res, next) => {
    db.insert(req, function(data) {
        res.send(data)
    })
});
app.get("/events", (req, res, next) => {
    res.header("Content-Type", 'application/json')
    db.get(function(data) {
        res.send(JSON.stringify(data, null, 2) + '\n')
    }, false)
});
app.get("/trending", (req, res, next) => {
    db.get(function(data) {
        res.send(data)
    }, 'trending')
});
app.get("/recent", (req, res, next) => {
    db.get(function(data) {
        res.send(data)
    }, 'recent', req)
});


/****************************************
 * IMAGE APIS
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
        }else{
            res.json(data)
        }
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

    request.post(options, (err, results, body) => {
        try {
            if (err) {
                res.send(err)
            }
            body = JSON.parse(body)
            if (body.hasOwnProperty('data') && body.data.hasOwnProperty('token')) {
                const token = body.data.token
                getFlatIcon(req.query, token, function(data) {
                    const dataObj = JSON.parse(data)
                    dataObj.data = dataObj.data.slice(0, req.query.limit)
                    res.json(dataObj)
                })
            }

        } catch (err) {
            console.log(err)
            res.send(err)
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
    }
    request.get(options2, (err, res, body) => {
        if (err) {
            callback(err);
        }
        callback(body)
    })
}

function getParams(params) {
    return Object.entries(params).map(entry => entry.join("=")).join("&");
}


/****************************************
 * WORDS
 ****************************************/

app.get("/synonyms", (req, res, next) => {

    getSynonyms(req.query.term, function(data) {
        res.json(data)
    })

    function getSynonyms(term, callback) {
        const biglabskey = '045145eebbf50c7e68cad637c21e6608'
        const options = {
            url: 'https://words.bighugelabs.com/api/2/045145eebbf50c7e68cad637c21e6608/' + req.query.term + '/json'
        }
        request.get(options, (err, res, body) => {
            if (err) {
                callback(err);
            }
            callback(body)
        })
    }
})