const port = process.env.PORT || 3000;
const express = require("express");
const path = require("path");
const app = express();
const request = require("request")
const https = require("https")
const async = require('async')
const bodyParser = require('body-parser')
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
 * METRICS
 ****************************************/

const db = require('./db')
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
app.get("/recent/:limit", (req, res, next) => {
    db.get(function(data) {
        res.send(data)
    }, 'recent', req)
});
app.get("/top/:limit", (req, res, next) => {
    db.get(function(data) {
        res.send(data)
    }, 'top', req)
});

/****************************************
 * IMAGE APIS
 ****************************************/

const routes = require('./api/routes')
for(var i = 0, length1 = routes.length; i < length1; i++){
    let params = routes[i]
    console.log('params', params)
    app.get(params.name, function(req, res, next){
        params.fn(req, res, next)
    })
}