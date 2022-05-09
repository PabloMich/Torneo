const Liga = require("../models/modeloLiga");
const Equipo = require("../models/modeloEquipo");
const encriptar = require("bcrypt-nodejs");

function crearLiga(req, res) {
  var parametros = req.body;
  var ligaModelo = new Liga();

  if (parametros.nombre) {

    Liga.findOne({ nombreLiga: parametros.nombre }, (error, ligaEncontrada) => {
      if (error) return res.status(500).send({ mensaje: "Error de la petición" });
      if (!ligaEncontrada) {

        ligaModelo.nombreLiga = parametros.nombre;
        ligaModelo.idUsuario = req.user.sub;

        ligaModelo.save((error, ligaGuardada) => {
          if (error) return res.status(500).send({ mensaje: "Error de la petición" });
          if (!ligaGuardada) return res.status(500).send({ mensaje: "Error, no se agrego ninguna liga" });

          return res.status(200).send({
            Liga: ligaGuardada, nota: "Liga agregada exitosamente"
          });
        });

      } else {
        return res.status(500).send({ mensaje: "Esta liga ya esta registrada" })
      }
    })
  } else {
    return res.status(500).send({ mensaje: "Envie los parametros obligatorios" });
  }
}

function verLigas(req, res) {
  Liga.find({ idUsuario: req.user.sub }, (error, ligasObtenidas) => {
    if (error) return res.send({ mensaje: "error:" + error })
    for (let i = 0; i < ligasObtenidas.length; i++) {
    }

    return res.send({ Ligas: ligasObtenidas })

  })
}

function editarLiga(req, res) {
  var idLiga = req.params.idLiga;
  var parametros = req.body;

  Liga.findOne({ _id: idLiga }, (error, ligaEncontrada) => {
    console.log(req.user.sub)
    console.log(ligaEncontrada.idUsuario)
    if (!ligaEncontrada) {
      return res.status(500).send({ mensaje: "No existe esta liga" });

    } else {
      if (req.user.sub !== ligaEncontrada.idUsuario) {
        return res.status(500).send({ mensaje: "No puede editar ligas de otros organizadores" });

      } else {
        Liga.findByIdAndUpdate(idLiga, parametros, { new: true }, (error, ligaActualizada) => {
          if (error) return res.status(500).send({ mesaje: "Error de la petición" });
          if (!ligaActualizada) return res.status(500).send({ mensaje: "Error al editar el empleado" });

          return res.status(200).send({
            Liga: ligaActualizada, nota: "Liga actualizada exitosamente"
          });
        });
      }
    }

  });
}

function eliminarLiga(req, res) {
  var idLiga = req.params.idLiga;

  Liga.findOne({ _id: idLiga }, (error, ligaEncontrada) => {
    if (ligaEncontrada) {

      if (req.user.sub != ligaEncontrada.idUsuario) {
        return res.status(500).send({ mensaje: "No se puede borrar Ligas de otros organizadores" });

      } else {
        Liga.findByIdAndDelete(idLiga, (error, ligaEliminada) => {
          if (error) return res.status(500).send({ mensaje: "Error de la petición" });
          if (!ligaEliminada) return res.status(404).send({ mensaje: "Error al eliminar la liga" });

          return res.status(200).send({
            Liga: ligaEliminada, nota: "Eliminada con exito"
          });
        });
      }
    } else {
      return res.status(500).send({ mensaje: "No existe esta liga" });
    }
  });
}

module.exports = {
  crearLiga,
  verLigas,
  editarLiga,
  eliminarLiga
};
