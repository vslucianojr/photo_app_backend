const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const Upload = require("./models/Upload");

routes.get("/uploads", async (req, res) => {
  const uploads = await Upload.find().sort({ createdAt: -1 });
  return res.json(uploads);
});

routes.post(
  "/uploads",
  multer(multerConfig).single("file"),
  async (req, res) => {
    const { originalname: name, size, key, location: url = "" } = req.file;

    const upload = await Upload.create({
      name,
      size,
      key,
      url,
    });

    return res.json(upload);
  }
);

routes.delete("/uploads/:id", async (req, res) => {
  const upload = await Upload.findById(req.params.id);

  await upload.remove();

  return res.send();
});

module.exports = routes;
