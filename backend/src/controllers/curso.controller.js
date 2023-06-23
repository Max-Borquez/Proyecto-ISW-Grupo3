const Curso = require("../models/curso.model");
const User = require("../models/user.model");

// Obtener todos los cursos
const getCursos = async (req, res) => {
  try {
    const cursos = await Curso.find()
    .populate({
      path: 'profesor',
      populate: {
        path: 'roles',
        select: 'name'
      }
    })
    .populate('clases')
    .populate('avisos')
    .populate({
      path: 'alumnos.alumno',
      populate: {
        path: 'roles',
        select: 'name'
      }
    });
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al obtener los cursos" });
  }
};

// Obtener un curso por su ID
const getCursoById = async (req, res) => {
  const { id } = req.params;
  try {
    const curso = await Curso.findById(id)
    .populate('profesor')
    .populate('clases')
    .populate('avisos')
    .populate('alumnos.alumno');;
    if (!curso) {
      return res.status(404).json({ error: "No se encontró el curso" });
    }
    res.status(200).json(curso);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al obtener el curso" });
  }
};

// Crear un nuevo curso
const createCurso = async (req, res) => {
  const { nombre, descripcion, estado, fecha_inicio, fecha_fin, profesor } = req.body;
  try {
    const curso = new Curso({
      nombre,
      descripcion,
      estado,
      fecha_inicio,
      fecha_fin,
      profesor,
    });
    const nuevoCurso = await curso.save();
    res.status(201).json(nuevoCurso);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al crear el curso" });
  }
};

// Actualizar un curso
const updateCurso = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado, fecha_inicio, fecha_fin, profesor } = req.body;
  try {
    const curso = await Curso.findByIdAndUpdate(
      id,
      {
        nombre,
        descripcion,
        estado,
        fecha_inicio,
        fecha_fin,
        profesor,
      },
      { new: true }
    );
    if (!curso) {
      return res.status(404).json({ error: "No se encontró el curso" });
    }
    res.status(200).json(curso);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al actualizar el curso" });
  }
};

// Eliminar un curso
const deleteCurso = async (req, res) => {
  const { id } = req.params;
  try {
    const curso = await Curso.findByIdAndDelete(id);
    if (!curso) {
      return res.status(404).json({ error: "No se encontró el curso" });
    }
    res.status(200).json({ message: "Curso eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al eliminar el curso" });
  }
};

// Cambiar el estado de un curso
const changeEstadoCurso = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const curso = await Curso.findByIdAndUpdate(
      id,
      { estado },
      { new: true },
    );
    if (!curso) {
      return res.status(404).json({ error: "No se encontró el curso" });
    }
    res.status(200).json(curso);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al cambiar el estado del curso" });
  }
};

// Cambiar el profesor de un curso
const changeProfesor = async (req, res) => {
  const { id } = req.params;
  const { profesor } = req.body;
  try {
    const curso = await Curso.findByIdAndUpdate(
      id,
      { profesor: profesor },
      { new: true }
    );
    if (!curso) {
      return res.status(404).json({ error: "No se encontró el curso" });
    }
    res.status(200).json(curso);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al cambiar el profesor del curso" });
  }
};


// Obtener todos los cursos de un profesor
const getCursosByProfesor = async (req, res) => {
  const { profesorId } = req.params;
  try {
    const cursos = await Curso.find({ profesor: profesorId })
    .populate({
      path: 'profesor',
      populate: {
        path: 'roles',
        select: 'name'
      }
    })
    .populate('clases')
    .populate('avisos')
    .populate({
      path: 'alumnos.alumno',
      populate: {
        path: 'roles',
        select: 'name'
      }
    });
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al obtener los cursos del profesor" });
  }
};

// Inscribir a un alumno en un curso
async function inscribirAlumnoEnCurso(req, res) {
  try {
    const { cursoId, alumnoId } = req.params;

    const curso = await Curso.findOne({ _id: cursoId, estado: "Disponible" });
    if (!curso) {
      return res.status(404).json({ message: "El curso no está disponible." });
    }

    const alumnoInscrito = curso.alumnos.find((alumnoInscrito) => alumnoInscrito.alumno.toString() === alumnoId);
    if (alumnoInscrito) {
      return res.status(400).json({ message: "El alumno ya está inscrito en este curso." });
    }

    curso.alumnos.push({ alumno: alumnoId, estado: "Cursando" }); // Fix: Changed `alumno.toString()` to `alumnoId`
    await curso.save();

    res.status(200).json({ message: "El alumno ha sido inscrito en el curso exitosamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al inscribir al alumno en el curso.", error });
  }
}

// Función para cambiar el estado de un alumno en un curso
async function cambiarEstadoAlumno(req, res) {
  const { cursoId, alumnoId } = req.params;
  const { nuevoEstado } = req.body;

  try {
    // Verificar si el curso existe
    const curso = await Curso.findById(cursoId);
    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    // Buscar al alumno en el arreglo de alumnos del curso
    const alumno = curso.alumnos.find(
      (alumno) => alumno.alumno.toString() === alumnoId
    );
    if (!alumno) {
      return res.status(404).json({ mensaje: "Alumno no encontrado en el curso" });
    }

    // Cambiar el estado del alumno
    alumno.estado = nuevoEstado;

    // Guardar el curso actualizado
    await curso.save();

    res.json({ mensaje: "Estado del alumno actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cambiar el estado del alumno" });
  }
}

// Eliminar un alumno de un curso
const eliminarAlumno = async (req, res) => {
  const { cursoId, alumnoId } = req.params;

  try {
    // Verificar si el curso y el alumno existen
    const curso = await Curso.findById(cursoId);
    const alumno = await User.findById(alumnoId);

    if (!curso || !alumno) {
      return res.status(404).json({ error: "Curso o alumno no encontrado" });
    }

    curso.alumnos = curso.alumnos.filter((alumnoCurso) => {
      return alumnoCurso.alumno.toString() !== alumnoId;
    });

    await curso.save();

    res.status(200).json({ mensaje: "Alumno eliminado del curso correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al eliminar al alumno del curso" });
  }
};


module.exports = {
  getCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso,
  changeEstadoCurso,
  changeProfesor,
  getCursosByProfesor,
  inscribirAlumnoEnCurso,
  eliminarAlumno,
  cambiarEstadoAlumno,
};
