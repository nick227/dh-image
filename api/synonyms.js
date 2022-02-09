const request = require("request")
const API_KEYS = require('../keys')

module.exports = function(req, res, next) {

    getSynonyms(req.query.term, function(data) {
        res.json(data)
    })

    function getSynonyms(term, callback) {
        const options = {
            url: 'https://words.bighugelabs.com/api/2/'+API_KEYS.biglabs.key+'/' + req.query.term + '/json'
        }
        request.get(options, (err, res, body) => {
            if (err) {
                callback(err);
            }
            callback(body)
        })
    }

}