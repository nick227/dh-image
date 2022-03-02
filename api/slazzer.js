const request = require("request");
const fs = require("fs");
const API_KEYS = require('../keys')
const path = require("path")

module.exports = function(req, res, next) {
const inputPath = path.resolve(__dirname, '../images/motorcycle.jpg')
const settings = {
  url: "https://api.slazzer.com/v2.0/remove_image_background",
  apiKey: API_KEYS.slazzer.key,
  sourceImagePath: inputPath,
  outputImagePath: "output.png"
};

request.post(
  {
    url: settings.url,
    formData: {source_image_file: fs.createReadStream(settings.sourceImagePath),},
    headers: {"API-KEY": settings.apiKey,},
    encoding: null,
  },
  function (error, response, body) {
    if(error){ console.log(error); return;}
    res.send(body.toString('utf8'))
    fs.writeFileSync(settings.outputImagePath, body);
  }
);

}