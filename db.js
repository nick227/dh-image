
const async = require('async')
const mysql = require('mysql')
const API_KEYS = require('./keys')

/****************************************
 * DB
 ****************************************/

const db = {
    connect: function() {
        return mysql.createConnection(API_KEYS.mysql.auth);
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
                const limit = req.params.limit ? req.params.limit : 3
                const q = `SELECT * FROM event WHERE ip = "${req.ip}" AND type="image" GROUP BY thumb ORDER BY timestamp DESC LIMIT ${limit}`
                doSelect(q, callback)
            },
            top: async function() {
                const limit = req.params.limit ? req.params.limit : 3
                const q = `SELECT *, count(thumb) as d FROM event WHERE type="image" GROUP BY thumb ORDER BY d DESC LIMIT ${limit}`
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
module.exports = db