const request = require("request")
const API_KEYS = require('../keys')
module.exports = function(req, res, next) {
        const urls = {
            icons: 'https://search.icons8.com/api/iconsets/v5/search?',
            vectors: 'https://api-illustrations.icons8.com/api/v2/illustrations/search?'
        }
        const url = urls[req.params.key] + 'token=' + API_KEYS.icon8[req.params.key] + '&' + getParams(req.query)
        request.get(url, (err, result, body) => {
            if (err) {
                res.send(err);
            }
            res.json(body)
        })
    }

function getParams(params) {
    return Object.entries(params).map(entry => entry.join("=")).join("&");
}