const { conexion } = require("./basedatos/conexion");
require("dotenv").config();
const cors = require("cors");

const express = require("express");

// conectar a la base de datos
conexion();

const app = express();

// configurar el cors
app.use(cors({
  origin: '*'
}));
// convertir el body a json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas
const rutas_articulo = require("./rutas/articulo_rutas");
const rutaImagen = require("./rutas/image.rutas");

// Cargo Las rutas
app.use("/api", rutas_articulo);
app.use("/api", rutaImagen);

app.get("/probando", (req, res) =>
  res.status(200).json({
    mensaje: "Probando el servidor de Node y Express....",
  })
);

// iniciar el servidor
app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
