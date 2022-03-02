const cloudinary = require('cloudinary').v2
const API_KEYS = require('../keys')
const crypto = require('crypto')

module.exports = async function(req, res, next) {
    const fileName = typeof name === 'string' ? name : generateName()
    const imgData = req.body.url ? req.body.url : req.body.base64img
    await saveImg(imgData, fileName, function(response) {
        res.send(response)
    })
}

async function saveImg(url, name, callback) {
    cloudinary.config({
        cloud_name: API_KEYS.cloudinary.name,
        api_key: API_KEYS.cloudinary.key,
        api_secret: API_KEYS.cloudinary.secret,
        secure: true
    });
    await cloudinary.uploader.upload(url, { public_id: name },
        function(error, result) {
          if(error){
          console.log("error")
            callback(error)

          }else{
            callback(result)

          }
        });
}

function generateName() {
    return crypto.randomBytes(10).toString('hex');
}

/*
{
  asset_id: 'a48b99bbeff01e46a26bcd0e342e1a6c',
  public_id: 'olympic_flag',
  version: 1646187588,
  version_id: 'd15517b57dc0093c75936701b328055e',
  signature: '16228a60b8677036f6730302e0e122383df535a1',
  width: 4272,
  height: 2848,
  format: 'jpg',
  resource_type: 'image',
  created_at: '2022-03-02T02:19:48Z',
  tags: [],
  bytes: 2678479,
  type: 'upload',
  etag: '7f9b962756ce7880affab2641c7a17de',
  placeholder: false,
  url: 'http://res.cloudinary.com/dh-image/image/upload/v1646187588/olympic_flag.jpg',
  secure_url: 'https://res.cloudinary.com/dh-image/image/upload/v1646187588/olympic_flag.jpg',
  original_filename: 'Olympic_flag',
  api_key: '985388728134625'
}
*/