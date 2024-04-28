const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const ImageModel = require("../modelos/image.model");

// MULTER
const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: Storage,
}).single("testImage");

router.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error uploading file.");
        }

        // Check if file exists
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const newImage = new ImageModel({
            name: req.body.name,
            image: {
                data: req.file.filename,
                contentType: "image/png",
            },
        });

        newImage
            .save()
            .then(() => {
                res.send("Imagen guardada");
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error saving image.");
            });
    });
});

module.exports = router;
