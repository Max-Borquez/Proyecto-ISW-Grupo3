"use strict";
const Asistencia = require("../models/Asistencia");
const Clase = require("../models/Clase");
const { handleError } = require("../utils/errorHandler");
const { asistenciaBodySchema } = require("../schema/asistencia.schema");

async function marcarAsistencia(alumnoId, cursoId, claseId, presente) {
  try {
    const { error } = asistenciaBodySchema.validate({ presente });
    if (error) return null;

    let asistencia = await Asistencia.findOne({
      alumno: alumnoId,
      curso: cursoId,
      clase: claseId,
    });

    if (!asistencia) {
      asistencia = new Asistencia({
        alumno: alumnoId,
        curso: cursoId,
        clase: claseId,
        presente,
      });
    } else {
      asistencia.presente = presente;
    }

    await asistencia.save();

    return asistencia;
  } catch (error) {
    handleError(error, "asistencia.service -> marcarAsistencia");
  }
}

async function corregirAsistencia(alumnoId, cursoId, claseId, presente) {
  try {
    const { error } = asistenciaBodySchema.validate({ presente });
    if (error) return null;

    const asistencia = await Asistencia.findOne({
      alumno: alumnoId,
      curso: cursoId,
      clase: claseId,
    });

    if (!asistencia) {
      return null;
    }

    asistencia.presente = presente;
    await asistencia.save();

    return asistencia;
  } catch (error) {
    handleError(error, "asistencia.service -> corregirAsistencia");
  }
}

async function obtenerEstadisticasAsistencia(cursoId, alumnoId) {
  try {
    const clases = await Clase.find({ curso: cursoId });
    const totalClases = clases.length;

    const asistencias = await Asistencia.find({ curso: cursoId, alumno: alumnoId });
    const clasesAsistidas = asistencias.length;

    const porcentajeAsistencia = (clasesAsistidas / totalClases) * 100;

    return {
      totalClases,
      clasesAsistidas,
      porcentajeAsistencia,
    };
  } catch (error) {
    handleError(error, "asistencia.service -> obtenerEstadisticasAsistencia");
  }
}

module.exports = {
  marcarAsistencia,
  corregirAsistencia,
  obtenerEstadisticasAsistencia,
};
