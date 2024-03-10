const fs = require("fs");
const path = require("path");
const Articulo = require("../modelos/Articulo");
const validarArticulo = require("../helpers/validar");

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Probando el controlador de articulo",
  });
};

const curso = (req, res) => {
  return res
    .status(200)
    .json({ curso: "Curso 1", precio: 20, descripcion: "Curso de prueba" });
};

// CREAR ARTICULO
const crear = (req, res) => {
  // recoger parametros por post a guardar
  let parametros = req.body;

  // validar datos (validator)
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Error creando artículo. Faltan datos por enviar",
    });
  }
  // crear el objeto a guardar
  const articulo = new Articulo(parametros);

  // Asignar valores a objeto basado en los valores del post

  // Guardar el artículo en la base de datos
  articulo
    .save()
    .then((articuloGuardado) => {
      // Devolver una respuesta exitosa
      return res.status(200).json({
        mensaje: "Creando artículo",
        articulo: articuloGuardado,
        parametros,
      });
    })
    .catch((err) => {
      // Manejar el error
      return res.status(400).json({
        status: "error",
        mensaje: "El artículo no se ha guardado",
      });
    });
};

// LISTAR ARTICULOS
const listar = async (req, res) => {
  try {
    let consulta = Articulo.find({});

    if (req.params.ultimos) {
      consulta = consulta.limit(req.params.ultimos);
    }

    // Await the execution of the query and store the result in 'articulos'
    const articulos = await consulta.sort({ fecha: "desc" }).exec();

    if (!articulos || articulos.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No hay articulos para mostrar",
      });
    }

    return res.status(200).json({
      status: "success",
      articulos,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Error al devolver los articulos",
    });
  }
};

// OBTENER UN ARTICULO
const uno = async (req, res) => {
  try {
    let id = req.params.id;
    const articulo = await Articulo.findById(id);

    return res.status(200).json({
      status: "success",
      articulo,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Error al devolver el articulo",
    });
  }
};

// Borrar articulo
const borrar = async (req, res) => {
  try {
    let id = req.params.id;

    const articulo = await Articulo.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      articulo,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Error al borrar el articulo",
    });
  }
};

// Editar articulo
const editar = async (req, res) => {
  let articuloId = req.params.id;
  let parametros = req.body;

  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  try {
    const ArticuloActualizado = await Articulo.findOneAndUpdate(
      { _id: articuloId },
      parametros,
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      ArticuloActualizado,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Error al actualizar el articulo",
    });
  }
};

const subir = async (req, res) => {
  // Configurar Multer

  // Recoger el fichero de imagen subido
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      mensaje: "No se ha subido ninguna imagen",
    });
  }

  // Nombre del archivo
  let archivo = req.file.originalname;

  // Extensión del archivo
  let archivo_split = archivo.split(".");
  let archivo_extension = archivo_split[1];

  // Comprobar extensión de imagen
  if (
    archivo_extension != "png" &&
    archivo_extension != "jpg" &&
    archivo_extension != "jpeg" &&
    archivo_extension != "gif"
  ) {
    try {
      // Borrar el archivo subido cuando no es extensión válida
      await fs.promises.unlink(req.file.path);
      return res.status(400).json({
        status: "error",
        mensaje: "La extensión del archivo no es válida",
      });
    } catch (err) {
      // Handle error during file deletion
      return res.status(500).json({
        status: "error",
        mensaje: "Error al eliminar el archivo no válido",
      });
    }
  } else {
    // Si todo es válido, guardar el artículo
    let id = req.params.id;

    try {
      const articuloActualizado = await Articulo.findOneAndUpdate(
        { _id: id },
        { imagen: req.file.filename },
        { new: true }
      );

      if (!articuloActualizado) {
        return res.status(404).json({
          status: "error",
          mensaje: "Artículo no encontrado",
        });
      }

      return res.status(200).json({
        status: "success",
        files: req.file,
        articuloActualizado,
        fichero: req.file,
      });
    } catch (err) {
      // Handle error during database operation
      return res.status(500).json({
        status: "error",
        mensaje: "Error al guardar la imagen del artículo",
      });
    }
  }
};

// MOSTRAR IMAGEN
const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta_fisica = "./imagenes/articulos/" + fichero;

  fs.stat(ruta_fisica, (error, existe) =>{
    if (existe){
      return res.sendFile(path.resolve(ruta_fisica));
    }else{
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe"
      })
    }
  })
};

module.exports = {
  prueba,
  curso,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
};
