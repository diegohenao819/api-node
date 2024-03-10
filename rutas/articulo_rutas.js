const express = require("express");
const multer = require("multer");
const articuloControlador = require("../controladores/articulo_controlador");

const router = express.Router();

// MULTER
const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/articulos/");
  },
  filename: function (req, file, cb) {
    cb(null, "articulo" + Date.now() + file.originalname);
  },
});
const subidas = multer({ storage: almacenamiento });

// Ruta de prueba
router.get("/rutaPrueba", articuloControlador.prueba);
router.get("/curso", articuloControlador.curso);
router.post("/crear", articuloControlador.crear);
router.get("/articulos/:ultimos?", articuloControlador.listar);
router.get("/articulo/:id", articuloControlador.uno);
router.delete("/articulo/:id", articuloControlador.borrar);
router.put("/articulo/:id", articuloControlador.editar);
router.post(
  "/subir-imagen/:id",
  [subidas.single("file0")],
  articuloControlador.subir
);
router.get("/imagen/:fichero", articuloControlador.imagen);

module.exports = router;
