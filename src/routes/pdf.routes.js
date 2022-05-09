const express = require('express');
const controlador = require('../controllers/EquiposController');
var api = express.Router();

const md_autenticacion = require("../middlewares/autenticacion")

/* api.post('/generarReporte/:liga/:idUsuario?', md_autenticacion.Auth, equipoControlador.generarReporte); */

module.exports = api;