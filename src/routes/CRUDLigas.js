const express = require('express');
const controlador = require('../controllers/LigasController');
var api = express.Router();

const md_autenticacion = require("../middlewares/autenticacion")

api.post('/crearLiga', md_autenticacion.Auth, controlador.crearLiga);
api.get('/verLiga', md_autenticacion.Auth, controlador.verLigas)
api.put('/editarLiga/:idLiga', md_autenticacion.Auth, controlador.editarLiga);
api.delete('/eliminarLiga/:idLiga', md_autenticacion.Auth, controlador.eliminarLiga);

module.exports = api;