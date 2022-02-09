const request = require("request")
const API_KEYS = require('../keys')
const NounProject = require('the-noun-project');

module.exports = function(req, res, next) {
    nounProject = new NounProject(API_KEYS.noun);
    nounProject.getIconsByTerm(req.query.term, { limit: req.query.limit }, function(err, data) {
        if (err) {
            res.send(err)
        }else{
            res.json(data)
        }
    });
    }

function getParams(params) {
    return Object.entries(params).map(entry => entry.join("=")).join("&");
}