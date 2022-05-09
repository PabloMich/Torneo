const express = require('express');
const cors = require('cors');
var app = express();

const rutaInicio = require('./src/routes/CrearAdmin');
const rutasUsuarios = require('./src/routes/CRUDUsuarios');
const rutasLigas = require('./src/routes/CRUDLigas');
const rutasEquipos = require('./src/routes/CRUDEquipos');
const rutasPartidos = require('./src/routes/CRUDPartidos');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', rutaInicio, rutasUsuarios, rutasLigas, rutasEquipos, rutasPartidos);


module.exports = app;