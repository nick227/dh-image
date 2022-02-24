const request = require("request")
const API_KEYS = require('../keys')
module.exports = function(req, res, next) {
        const urls = {
            search: 'https://search.icons8.com/api/iconsets/v5/search?',
            icons: 'https://api-icons.icons8.com/publicApi/icons?',
            vectors: 'https://api-illustrations.icons8.com/api/v2/illustrations/search?'
        }
        const url = urls['vectors'] + 'token=' + API_KEYS.icon8['vectors'] + '&' + getParams(req.query)
        console.log('url: ', url)
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