const Asistencia = require("../models/asistencia.model");
const Curso = require("../models/curso.model");

// Marcar la asistencia de un alumno en una clase
const marcarAsistencia = async (req, res) => {
  const { alumnoId, cursoId, claseId } = req.params;
  const { presente } = req.body;

  try {
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
      return res.status(400).json({ error: "La asistencia ya ha sido marcada" });
    }

    await asistencia.save();

    res.status(200).json(asistencia);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al marcar la asistencia" });
  }
};


// Corregir la asistencia de un alumno en una clase
const corregirAsistencia = async (req, res) => {
  const { alumnoId, cursoId, claseId } = req.params;

  try {
    // Verificar si la asistencia existe
    const asistencia = await Asistencia.findOne({
      alumno: alumnoId,
      curso: cursoId,
      clase: claseId,
    });

    if (!asistencia) {
      return res.status(404).json({ error: "Asistencia no encontrada" });
    }

    // Cambiar el valor de presente al valor contrario
    asistencia.presente = !asistencia.presente;
    await asistencia.save();

    res.status(200).json(asistencia);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al corregir la asistencia" });
  }
};

// Obtener las estadísticas de asistencia del alumno en un curso
async function obtenerEstadisticasAsistencia(req, res) {
  try {
    const { cursoId, alumnoId } = req.params;

    // Obtener el curso
    const curso = await Curso.findById(cursoId);
    if (!curso) {
      return res.status(404).json({ message: "El curso no existe" });
    }

    // Obtener la cantidad total de clases
    const totalClases = curso.clases.length;

    // Obtener las asistencias del alumno en el curso
    const asistencias = await Asistencia.find({ curso: cursoId, alumno: alumnoId });

    // Contar las clases a las que el alumno ha asistido
    let clasesAsistidas = 0;
    asistencias.forEach(asistencia => {
      if (asistencia.presente) {
        clasesAsistidas++;
      }
    });

    // Calcular el porcentaje de asistencia
    const porcentajeAsistencia = (clasesAsistidas / totalClases) * 100;

    res.status(200).json({
      totalClases,
      clasesAsistidas,
      porcentajeAsistencia,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las estadísticas de asistencia.", error });
  }
}

async function obtenerAsistenciasAlumnoCurso(req, res) {
  try {
    const { cursoId, alumnoId } = req.params;

    // Verificar si el curso existe
    const curso = await Curso.findById(cursoId);
    if (!curso) {
      return res.status(404).json({ message: "El curso no existe" });
    }

    // Obtener las asistencias del alumno en el curso
    const asistencias = await Asistencia.find({ curso: cursoId, alumno: alumnoId });

    res.status(200).json(asistencias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las asistencias del alumno en el curso.", error });
  }
}

async function obtenerEstadisticasAsistenciaCurso(req, res) {
  try {
    const { cursoId } = req.params;

    // Verificar si el curso existe
    const curso = await Curso.findById(cursoId);
    if (!curso) {
      return res.status(404).json({ message: "El curso no existe" });
    }

    const totalClases = curso.clases.length;
    const totalAlumnos = curso.alumnos.length;

    const estadisticasClases = [];

    // Obtener las asistencias de cada clase
    for (const claseId of curso.clases) {
      const asistencias = await Asistencia.find({ curso: cursoId, clase: claseId, presente: true });
      const asistenciasClase = asistencias.length;
      const porcentajeAsistenciasClase = (asistenciasClase / totalAlumnos) * 100;

      estadisticasClases.push({
        claseId,
        asistenciasClase,
        totalAlumnos,
        porcentajeAsistenciasClase,
      });
    }

    res.status(200).json({
      totalClases,
      estadisticasClases,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las estadísticas de asistencia del curso.", error });
  }
}



module.exports = {
  marcarAsistencia,
  corregirAsistencia,
  obtenerEstadisticasAsistencia,
  obtenerAsistenciasAlumnoCurso,
  obtenerEstadisticasAsistenciaCurso,
};
