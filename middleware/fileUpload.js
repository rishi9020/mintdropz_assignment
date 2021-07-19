const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
require("dotenv").config();

aws.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.REGION
  });

let s3 = new aws.S3();

let upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET,
      key: function (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) { 
          // upload only png and jpg format
          return cb(new Error('Please upload Image Only'))
        }
        cb(null, Date.now() + '_' + file.originalname); 
      }
    })
  });

  module.exports = upload;

