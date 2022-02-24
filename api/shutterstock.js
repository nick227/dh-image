const sstk = require('shutterstock-api');
const API_KEYS = require('../keys')

module.exports = function(req, res, next) {
    sstk.setAccessToken(API_KEYS.shutterstock.token);
    const api = new sstk.ImagesApi();

    const queryParams = {
        query: 'New York',
        sort: 'popular',
        orientation: 'horizontal',
        per_page: 3
    };

    api.searchImages(req.query)
        .then(function({ data }) {
            console.log(data);
            res.json({ "results": data })
        })
        .catch(function(error) {
            console.error('error');
            console.error(error);
            res.json(error)
            console.error('error');
        });
}