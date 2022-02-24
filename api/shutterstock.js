const sstk = require('shutterstock-api');
const API_KEYS = require('../keys');

module.exports = function(req, res, next) {
    sstk.setAccessToken(API_KEYS.shutterstock.token);
    const api = new sstk.ImagesApi();

    api.searchImages(req.query)
        .then(function({ data }) {
            res.json({ "results": data })
        })
        .catch(function(error) {
            res.send(error)
        });
}