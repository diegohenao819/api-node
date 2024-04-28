const express = require("express");
const router = express.Router();
const multer = require("multer");
const ImageModel = require("../modelos/image.model");

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("testImage");

router.post("/upload", (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error uploading file.");
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        // Create a new image model instance, storing the image data and content type
        const newImage = new ImageModel({
            name: req.body.name,
            image: {
                data: req.file.buffer, // Use the buffer instead of filename
                contentType: req.file.mimetype, // Automatically detected mime type
            },
        });

        // Save the new image model instance to MongoDB
        newImage.save()
            .then(() => res.send("Imagen guardada"))
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error saving image.");
            });
    });
});

module.exports = router;
