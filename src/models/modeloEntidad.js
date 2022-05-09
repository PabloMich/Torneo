const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EntidadSchema = Schema({
    nombre: String,
    apellido: String,
    usuario: String,
    rol: String,
    password: String
});

module.exports = mongoose.model("Entidades", EntidadSchema);