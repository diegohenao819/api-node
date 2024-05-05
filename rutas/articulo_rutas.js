const express = require("express");
const articuloControlador = require("../controladores/articulo_controlador");
const router = express.Router();
const multer = require("multer");

// Configure multer to use memory storage
const storage = multer.memoryStorage();
// Función para filtrar archivos y permitir solo ciertos tipos de imágenes
const fileFilter = (req, file, cb) => {
    // Lista de tipos MIME permitidos
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Aceptar archivo
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF).'), false);
        // También puedes pasar un error si deseas enviar un mensaje específico
        // cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF)'), false);
    }
};
const upload = multer({ storage: storage,  fileFilter: fileFilter }).single('file0');

// Ruta de prueba
router.get("/rutaPrueba", articuloControlador.prueba);
router.get("/curso", articuloControlador.curso);
router.post("/crear", upload, articuloControlador.crear);
router.get("/articulos/:ultimos?", articuloControlador.listar);
router.get("/articulo/:id", articuloControlador.uno);
router.delete("/articulo/:id", articuloControlador.borrar);
router.put("/articulo/:id", articuloControlador.editar);
router.get("/imagen/:id", articuloControlador.imagen);
// Usamos una función de middleware anónima para manejar la carga y capturar errores
router.post("/subir-imagen/:id", (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            // Si Multer encuentra un error (como un tipo de archivo no permitido), enviamos una respuesta de error
            return res.status(400).json({
                status: "error",
                mensaje: err.message
            });
        }
        // Si no hay errores, continuamos al controlador siguiente
        next();
    });
}, articuloControlador.subir);



module.exports = router;
