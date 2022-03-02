const API_KEYS = require('../keys')
const removeBackgroundFromImageUrl = require('remove.bg').removeBackgroundFromImageUrl
const removeBackgroundFromImageFile = require('remove.bg').removeBackgroundFromImageFile
const removeBgError = require('remove.bg').RemoveBgError
const path = require("path")
const fs = require("fs")
const saveToCloudinary = require("./cloudinary.js")

module.exports = function(req, res, next) {
    const url = req.body.url
    remove(url, function(data) {
      req.body.url = 'data:image/png;base64,'+data
      saveToCloudinary(req, res, next)
    })
}
async function remove(url, callback) {
        //const outputFile = path.resolve(__dirname, '../images/output.png')
        const result = await removeBackgroundFromImageUrl({
            url,
            apiKey: API_KEYS.removebg.key
            /*,
            size: "regular",
            type: "product",
            outputFile
            */
       });
        callback(result.base64img)
 
}


/*
        console.log(`File saved to ${outputFile}`);
        console.log(`${result.creditsCharged} credit(s) charged for this image`);
        console.log(`Result width x height: ${result.resultWidth} x ${result.resultHeight}, type: ${result.detectedType}`);
        console.log(result.base64img);
        console.log(`Rate limit: ${result.rateLimit}, remaining: ${result.rateLimitRemaining}, reset: ${result.rateLimitReset}, retryAfter: ${result.retryAfter}`);

*/