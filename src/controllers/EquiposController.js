const Equipo = require("../models/modeloEquipo");
const Liga = require("../models/modeloLiga");

function crearEquipo(req, res) {
    var parametros = req.body;
    var equipoModel = new Equipo()
    var idUsuario;

    if (req.user.rol == "Organizador") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "debe enviar el id del usuario al que quiere crearle un equipo",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Equipo.findOne({ idUsuario: idUsuario, nombre: parametros.nombre }, (err, equipoEncontrado) => {
        if (equipoEncontrado) {
            res.status(500).send({ error: "el equipo ya existe" })
        } else {
            if (req.params.liga == null) return res.status(500)
                .send({ mensaje: "Debe poner el nombre de la liga a la que quiere asignar su equipo" });

            Liga.findOne({ idUsuario: idUsuario, nombre: req.params.liga }, (err, ligaEncontrada) => {
                if (ligaEncontrada == null) {
                    res.status(500).send({ error: "no existe la liga a la que usted desea asignar el equipo" })
                } else {
                    Equipo.find({ idLiga: ligaEncontrada._id }, (err, equiposEncontrados) => {
                        if (equiposEncontrados.length < 10) {
                            if (parametros.nombre) {
                                equipoModel.nombre = parametros.nombre
                                equipoModel.golesFavor = 0;
                                equipoModel.golesContra = 0;
                                equipoModel.diferenciaGoles = 0;
                                equipoModel.partidosJugados = 0;
                                equipoModel.puntos = 0;
                                equipoModel.idUsuario = idUsuario;
                                equipoModel.idLiga = ligaEncontrada._id;

                                equipoModel.save((err, equipoCreado) => {
                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                    if (!equipoCreado)
                                        return res.status(500).send({ mensaje: "Error al crear el equipo" });
                                    return res.status(200).send({ equipo: equipoCreado });
                                })

                            } else {
                                return res
                                    .status(500)
                                    .send({ mensaje: "Debe poner el nombre de el equipo que desea crear" });
                            }
                        } else {
                            return res
                                .status(500)
                                .send({ mensaje: "la liga ya llego al limite de 10 equipos" });
                        }
                    })
                }

            })
        }
    })
}

function editarEquipo(req, res) {
    var idUsuario;

    if (req.params.nombre == null) return res.status(500).send({ error: "debe enviar el nombre del equipo que editará" })

    if (req.user.rol == "Organizador") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "debe enviar el id del usuario al que quiere editarle un equipo",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Equipo.findOne({ idUsuario: idUsuario, nombre: req.body.nombre }, (err, equipoRepetido) => {
        if (equipoRepetido) {
            return res.status(500).send({ error: "ya hay un equipo con ese nombre, elija otro" });
        } else {
            Equipo.findOneAndUpdate({ nombre: req.params.nombre, idUsuario: idUsuario }, { nombre: req.body.nombre }, { new: true }, (err, equipoEditado) => {
                if (equipoEditado == null)
                    return res.status(500).send({ error: "no se encontró el equipo" });
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

                return res.status(200).send({ equipo: equipoEditado });
            })
        }
    })
}

function eliminarEquipo(req, res) {
    var idUsuario;

    if (req.params.nombre == null) return res.status(500).send({ error: "debe enviar el nombre del equipo que eliminará" })

    if (req.user.rol == "Organizador") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "debe enviar el id del usuario al que quiere eliminar el equipo",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Equipo.findOneAndDelete({ nombre: req.params.nombre, idUsuario: idUsuario }, { nombre: req.body.nombre }, (err, equipoEditado) => {
        if (equipoEditado == null)
            return res.status(500).send({ error: "no se encontró el equipo" });
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });


        return res.status(200).send({ equipo: equipoEditado });
    })

}

function verEquiposLiga(req, res) {
    var idUsuario;

    if (req.params.liga == null) return res.status(500).send({ error: "debe enviar el nombre de que liga quiere visualizar sus equipos" })


    if (req.user.rol == "Organizador") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "debe enviar el id del usuario al que quiere ver sus  equipos",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Liga.findOne({ nombre: req.params.liga, idUsuario: idUsuario }, (err, ligaEncontrada) => {
        if (!ligaEncontrada) {
            return res.status(500).send({ error: "no se encontró la liga" });
        } else {
            Equipo.find({ idUsuario: idUsuario, idLiga: ligaEncontrada._id }, (err, equiposEncontrados) => {
                if (equiposEncontrados.length == 0) return res.status(500).send({ mensaje: "no cuenta con equipos en esta liga" });
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

                return res.status(200).send({ equipos: equiposEncontrados })
            }).select('nombre')
        }
    })

}

function tablaLiga(req, res) {
    var idUsuario;

    if (req.params.liga == null) return res.status(500).send({ error: "debe enviar el nombre de que liga quiere visualizar su tabla" })


    if (req.user.rol == "Organizador") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "debe enviar el id del usuario al que quiere ver sus  equipos",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Liga.findOne({ nombre: req.params.liga, idUsuario: idUsuario }, (err, ligaEncontrada) => {
        if (!ligaEncontrada) {
            return res.status(500).send({ error: "no se encontró la liga" });
        } else {
            Equipo.find({ idUsuario: idUsuario, idLiga: ligaEncontrada._id }, (err, equiposEncontrados) => {
                if (equiposEncontrados.length == 0) return res.status(500).send({ mensaje: "no cuenta con equipos en esta liga" });
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

                return res.status(200).send({ tabla: equiposEncontrados })
            }).sort({ puntos: -1 })
        }
    })
}


function generarReporte(req, res) {
    var idUsuario;

    if (req.params.liga == null) return res.status(500).send({ error: "debe enviar el nombre de que liga quiere generar su reporte" })


    if (req.user.rol == "Organizador") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "debe enviar el id del usuario al que quiere generar su reporte",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Liga.findOne({ nombre: req.params.liga, idUsuario: idUsuario }, (err, ligaEncontrada) => {
        if (!ligaEncontrada) {
            return res.status(500).send({ error: "no se encontró la liga" });
        } else {
            Equipo.find({ idUsuario: idUsuario, idLiga: ligaEncontrada._id }, (err, equiposEncontrados) => {
                if (equiposEncontrados.length == 0) return res.status(500).send({ mensaje: "no cuenta con equipos en esta liga" });
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });


                generarPdf(req.params.liga, equiposEncontrados)
                return res.status(200).send({ mensaje: "reporte generado correctamente" })
            }).sort({ puntos: -1 })
        }
    })
}

function generarPdf(nombreLiga, equipos) {


    const fs = require('fs');
    const Pdfmake = require('pdfmake');

    fs.mkdir('./src/pdf', { recursive: true }, (err) => {
        if (err) throw err;
    });

    var fonts = {
        Roboto: {
            normal: './src/fonts/roboto/Roboto-Regular.ttf',
            bold: './src/fonts/roboto/Roboto-Medium.ttf',
            italics: './src/fonts/roboto/Roboto-Italic.ttf',
            bolditalics: './src/fonts/roboto/Roboto-MediumItalic.ttf'
        }
    };

    let pdfmake = new Pdfmake(fonts);

    let content = [{
        text: 'LIGA: ' + nombreLiga,
        alignment: 'center',
        fontSize: 25,
        color: '#e74c3c',
        bold: true,
        margin: [0, 0, 0, 20]
    }]

    var titulos = new Array('No.', 'Equipo', 'Pts', 'PJ', 'GF', 'GC');

    var body = []

    body.push(titulos)

    for (let i = 0; i < equipos.length; i++) {
        var datosEquipos = new Array((i + 1),
            equipos[i].nombre,
            equipos[i].puntos,
            equipos[i].partidosJugados,
            equipos[i].golesFavor,
            equipos[i].golesContra)
        body.push(datosEquipos)
    }

    content.push({
        text: ' ',
        margin: [0, 0, 0, 10]
    })


    content.push({
        layout: {
            fillColor: function (rowIndex, node, columnIndex) {
                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
            }
        },

        alignment: 'center',

        table: {
            heights: 20,
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*'],

            body: body

        },
        margin: [0, 0, 0, 10]
    })


    let documento = {
        pageSize: {
            width: 595.28,
            height: 841.89
        },
        content: content
    }
    let pdfDoc = pdfmake.createPdfKitDocument(documento, {});

    pdfDoc.pipe(fs.createWriteStream('./src/pdf/tabla ' + nombreLiga.toLowerCase() + '.pdf'));


    pdfDoc.end();

}

module.exports = {
    crearEquipo,
    editarEquipo,
    eliminarEquipo,
    verEquiposLiga,
    tablaLiga,
    generarReporte
}