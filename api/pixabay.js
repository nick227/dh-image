const request = require("request")
const API_KEYS = require('../keys')
module.exports = function(req, res, next) {
        const url = 'https://pixabay.com/api/?key='+API_KEYS.pixabay.id
        request.get(url, (err, result, body) => {
            if (err) {
                res.send(err);
                return;
            }
            res.json(body)
        })
    }

function getParams(params) {
    return Object.entries(params).map(entry => entry.join("=")).join("&");
}