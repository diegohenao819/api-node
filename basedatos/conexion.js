require('dotenv').config();
const mongoose = require('mongoose');

const conexion = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Base de datos conectada');
    } catch (error) {
        console.error(error);
        throw new Error('Error al iniciar la base de datos');
    }
}

module.exports = {
    conexion
}
