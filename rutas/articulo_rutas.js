const express = require("express");
const multer = require("multer");
const articuloControlador = require("../controladores/articulo_controlador");
const ImageModel = require("../modelos/image.model");

const router = express.Router();

// MULTER
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage
}).single("testImage");

// Ruta de prueba
router.get("/rutaPrueba", articuloControlador.prueba);
router.get("/curso", articuloControlador.curso);
router.post("/crear", articuloControlador.crear);
router.get("/articulos/:ultimos?", articuloControlador.listar);
router.get("/articulo/:id", articuloControlador.uno);
router.delete("/articulo/:id", articuloControlador.borrar);
router.put("/articulo/:id", articuloControlador.editar);
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
        contentType: "image/png"
      }
    });

    newImage.save()
      .then(() => {
        res.send("Imagen guardada");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving image.");
      });
  });
});

router.get("/imagen/:fichero", articuloControlador.imagen);

module.exports = router;
