
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
  // Accessing text data
  const { titulo, contenido } = req.body;

  // Accessing file data, if available
  const file = req.file; // Assumes that Multer middleware is named 'file'

  // Validate data
  try {
    validarArticulo({ titulo, contenido });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Validation failed (desde crear): " + error.message,
    });
  }

  // Create the article object with file data if available
  const articulo = new Articulo({
    titulo,
    contenido,
    image: file ? {  // Only add image data if file is uploaded
      data: file.buffer,
      contentType: file.mimetype
    } : {}
  });

  // Save the article to the database
  articulo.save()
    .then((articuloGuardado) => {
      // Respond with success
      return res.status(200).json({
        mensaje: "Artículo creado con éxito",
        articulo: articuloGuardado,
      });
    })
    .catch((err) => {
      // Handle saving error
      return res.status(400).json({
        status: "error",
        mensaje: "El artículo no se ha guardado (desde crear)",
        error: err.message,
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





// SUBIR IMAGEN
const subir = async (req, res) => {
  const file = req.file;
  if (!file) {
      return res.status(400).send('No file uploaded.');
  }

  try {
      const id = req.params.id;
      const articulo = await Articulo.findById(id);

      if (!articulo) {
          return res.status(404).send('Article not found.');
      }

      // Update the article with the image data
      articulo.image = {
          data: file.buffer,
          contentType: file.mimetype // This should capture the file type like 'image/jpeg'
      };

      await articulo.save(); // Saving the article with the updated image
      res.send('File uploaded and saved successfully.');

  } catch (err) {
      res.status(500).send('Server error: ' + err.message);
  }
};


// MOSTRAR IMAGEN
const imagen = async (req, res) => {
  let id = req.params.id;

  try {
    const articulo = await Articulo.findById(id);

    if (!articulo || !articulo.image || !articulo.image.data) {
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe o el artículo no tiene imagen."
      });
    }

    // Set the content-type of the response
    res.contentType(articulo.image.contentType);
    // Send the image data as a response
    return res.send(articulo.image.data);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al buscar la imagen"
    });
  }
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
