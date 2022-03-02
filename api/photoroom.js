const path = require("path")
const API_KEYS = require('../keys')
const removeBackgroundFromImageFile = require('remove.bg')




module.exports = function(req, res, next) {

const inputPath = path.resolve(__dirname, '../images/motorcycle.jpg')
const outputFile = `${__dirname}/out/img-removed-from-file.png`;

removeBackgroundFromImageFile({
  path: inputPath,
  apiKey: API_KEYS.photoroom.key,
  size: "regular",
  type: "auto",
  scale: "50%",
  outputFile 
}).then((result) => {
 console.log(`File saved to ${outputFile}`);

}).catch((errors) => {
 console.log(JSON.stringify(errors));
});





  /*
const formData = new FormData();
formData.append('size', 'auto');
formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

axios({
  method: 'post',
  url: 'https://api.remove.bg/v1.0/removebg',
  data: formData,
  responseType: 'arraybuffer',
  headers: {
    ...formData.getHeaders(),
    'X-Api-Key': API_KEYS.photoroom.key,
  },
  encoding: null
})
.then((response) => {
  if(response.status != 200) return console.error('Error:', response.status, response.statusText);
  fs.writeFileSync("no-bg.png", response.data);
})
.catch((error) => {
    return console.error('Request failed:', error);
});



const url = path.resolve(__dirname, '../images/motorcycle.jpg')

    fs.readFile(url, function(err, data) {
        if (err) throw err;

        const img = new Buffer.from(data, 'binary').toString('base64');
        getRemoveBg(img, function(response){
          res.send(response)
        })
                       
        //var encodedImage = new Buffer(data, 'binary').toString('base64');
        //var decodedImage = new Buffer(encodedImage, 'base64').toString('binary');
    });
*/
}

function getParams(params) {
    return Object.entries(params).map(entry => entry.join("=")).join("&");
}

function getRemoveBg(imageFile, callback) {
    const options = {
        url: 'https://sdk.photoroom.com/v1/segment',
        headers: {
            'x-api-key': API_KEYS.photoroom.key
        },
        body: JSON.stringify({
            image_file_b64: imageFile
        })
    };
console.log('send: ', options)
    request.post(options, (err, results, body) => {
        try {
            if (err) {
                console.log('error', err)
            }
            callback(body)

        } catch (err) {
          console.log('catch error')
            console.log(err)
            callback(err)
        }
    });
}