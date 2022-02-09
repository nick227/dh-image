const request = require("request")
const API_KEYS = require('../keys')

module.exports = function(req, res, next) {
    const options = {
        url: 'https://api.flaticon.com/v2/app/authentication',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            apikey: API_KEYS.flatIcon.key
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

}
function getParams(params) {
    return Object.entries(params).map(entry => entry.join("=")).join("&");
}
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