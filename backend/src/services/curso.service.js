"use strict";
const Curso = require("../models/curso");
const { handleError } = require("../utils/errorHandler");
const { cursoBodySchema } = require("../schema/curso.schema");

/**
 * @typedef Curso
 * @property {string} _id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {string} estado
 * @property {Date} fecha_inicio
 * @property {Date} fecha_fin
 * @property {string} profesor
 * @property {Array} alumnos
 * @property {Array} clases
 * @property {Array} avisos
 * @property {Array} calificaciones
 */

/**
 * @name getCursos
 * @description Obtiene todos los cursos
 * @returns {Promise<Curso[]|[]>}
 */
async function getCursos() {
  try {
    return await Curso.find();
  } catch (error) {
    handleError(error, "curso.service -> getCursos");
  }
}

/**
 * @name getCursoById
 * @description Obtiene un curso por su ID
 * @param id {string} - ID del curso
 * @returns {Promise<Curso|null>}
 */
async function getCursoById(id) {
  try {
    return await Curso.findById(id);
  } catch (error) {
    handleError(error, "curso.service -> getCursoById");
  }
}

/**
 * @name createCurso
 * @description Crea un nuevo curso
 * @param curso {Curso} - Objeto con los datos del curso
 * @returns {Promise<Curso|null>}
 */
async function createCurso(curso) {
  try {
    const { error } = cursoBodySchema.validate(curso);
    if (error) return null;

    const {
      nombre,
      descripcion,
      estado,
      fecha_inicio,
      fecha_fin,
      profesor,
      alumnos,
      clases,
      avisos,
      calificaciones,
    } = curso;

    const nuevoCurso = new Curso({
      nombre,
      descripcion,
      estado,
      fecha_inicio,
      fecha_fin,
      profesor,
      alumnos,
      clases,
      avisos,
      calificaciones,
    });
    return await nuevoCurso.save();
  } catch (error) {
    handleError(error, "curso.service -> createCurso");
  }
}

/**
 * @name updateCurso
 * @description Actualiza un curso
 * @param id {string} - ID del curso
 * @param curso {Curso} - Objeto con los datos actualizados del curso
 * @returns {Promise<Curso|null>}
 */
async function updateCurso(id, curso) {
  try {
    const { error } = cursoBodySchema.validate(curso);
    if (error) return null;

    return await Curso.findByIdAndUpdate(id, curso);
  } catch (error) {
    handleError(error, "curso.service -> updateCurso");
  }
}

/**
 * @name deleteCurso
 * @description Elimina un curso por su ID
 * @param id {string} - ID del curso
 * @returns {Promise<Curso|null>}
 */
async function deleteCurso(id) {
  try {
    return await Curso.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "curso.service -> deleteCurso");
  }
}

module.exports = {
  getCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso,
};
