const express = require('express');
const controlador = require('../controllers/EquiposController');
var api = express.Router();

const md_autenticacion = require("../middlewares/autenticacion")

api.post('/crearEquipo/:liga/:idUsuario?', md_autenticacion.Auth, controlador.crearEquipo);
api.put('/editarEquipo/:nombre/:idUsuario?', md_autenticacion.Auth, controlador.editarEquipo);
api.delete('/eliminarEquipo/:nombre/:idUsuario?', md_autenticacion.Auth, controlador.eliminarEquipo);
api.get('/verEquiposLiga/:liga/:idUsuario?', md_autenticacion.Auth, controlador.verEquiposLiga);
api.get('/verTablaLiga/:liga/:idUsuario?', md_autenticacion.Auth, controlador.tablaLiga);
/* api.post('/generarReporte/:liga/:idUsuario?', md_autenticacion.Auth, controlador.generarReporte); */

module.exports = api;