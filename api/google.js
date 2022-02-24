const request = require("request")
const API_KEYS = require('../keys')
module.exports = function(req, res, next) {
        const url = 'https://www.googleapis.com/customsearch/v1?key=' + API_KEYS.google.id + '&cx=' + API_KEYS.google.cx + '&searchType=image&'+getParams(req.query)
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