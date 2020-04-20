const mongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("fs");
const { promisify } = require("util");

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const UploadSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UploadSchema.pre("save", function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
  }
});

UploadSchema.pre("remove", function () {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: "uploadphotoapp",
        Key: this.key,
      })
      .promise();
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
    );
  }
});

module.exports = mongoose.model("Upload", UploadSchema);
