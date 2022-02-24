const request = require("request")
const API_KEYS = require('../keys')
module.exports = function(req, res, next) {
        const url = 'https://api.unsplash.com/search/photos?client_id='+API_KEYS.unsplash.id+'&'+getParams(req.query)
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