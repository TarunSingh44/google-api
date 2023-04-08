/* eslint-disable new-cap */
/**
 *  WIP
 * TODO: SWITCH TO S3 and configure
 *
 */
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const { v1: uuidv1 } = require('uuid')
const isBase64 = require('is-base64')
const utils = require('../middleware/utils')
const s3Client = new S3Client({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'nyc3',
  credentials: {
    accessKeyId: 'RAKFYHL5YOKLJNY7WLXS',
    secretAccessKey: process.env.SPACES_SECRET
  }
})

module.exports = (b64) => {
  return new Promise((resolve, reject) => {
    try {
      if (!isBase64(b64, {
        mimeRequired: true
      })) {
        reject(utils.buildErrObject(409, 'INVALID_BASE64_IMAGE'))
      }

      // Grab the extension and image type
      const ext = b64.split(';')[0].match(/jpeg|png|jpg|gif/)[0]
      const ContentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`

      // Generate unique name
      const fileName = `${uuidv1()}.${ext}`

      // strip off the data: url prefix to get just the base64-encoded bytes
      const buf = new Buffer.from(b64.replace(/^data:image\/\w+;base64,/, ''), 'base64')

      const params = {
        Bucket: 'skilzcdn',
        Key: fileName,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType,
        ACL: 'public-read'
      }

      s3Client.send(new PutObjectCommand(params)).then(data => {
        resolve(fileName)
      }).catch(err => {
        console.log(err)
        reject(utils.buildErrObject(409, 'ERROR_UPLOADING_IMAGE'))
      })
    } catch (err) {
      console.log(err)
      reject(utils.buildErrObject(409, 'ERROR_UPLOADING_IMAGE'))
    }
  })
}
