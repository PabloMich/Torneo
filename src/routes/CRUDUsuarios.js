const express = require('express');
const controlador = require('../controllers/UsuariosController');
var api = express.Router();

const md_autenticacion = require('../middlewares/autenticacion')

api.post('/registro', md_autenticacion.Auth, controlador.Registrar)
api.get('/usuarios', md_autenticacion.Auth, controlador.verUsuarios)
api.put('/editar/:idUsuario', md_autenticacion.Auth, controlador.editarUsuario)
api.delete('/eliminar/:idUsuario', md_autenticacion.Auth, controlador.eliminarUsuario)

module.exports = api;