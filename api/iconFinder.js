const request = require("request")
const API_KEYS = require('../keys')

module.exports = function(req, res, next) {
    const options = {
        url: 'https://api.iconfinder.com/v4/icons/search?'+getParams(req.query),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + API_KEYS.iconFinder.key 
        }
    };

    request.get(options, (err, results, body) => {
        try {
            if (err) {
                res.send(err)
            }
            res.json(body)

        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });

}
function getParams(params) {
    return Object.entries(params).map(entry => entry.join("=")).join("&");
}
