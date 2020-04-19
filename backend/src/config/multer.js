const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, res, callback) => {
      callback(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, callback) => {
      crypto.randomBytes(8, (err, hash) => {
        if (err) callback(err);
        file.key = `${hash.toString("hex")}-${file.originalname}`;

        callback(null, file.key);
      });
    },
  }),
  s3: multerS3({
    s3: new aws.S3({
      credentials: {
        accessKeyId: process.env.AWS_ACESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
      },
    }),
    bucket: "uploadphotoapp",
    // contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, callback) => {
      crypto.randomBytes(8, (err, hash) => {
        if (err) callback(err);

        const filename = `${hash.toString("hex")}-${file.originalname}`;

        callback(null, filename);
      });
    },
  }),
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: storageTypes[process.env.STORAGE_TYPE],
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type"));
    }
  },
};
