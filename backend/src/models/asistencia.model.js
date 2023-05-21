const mongoose = require("mongoose");

const asistenciaSchema = new mongoose.Schema({
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curso",
    required: true,
  },
  alumno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  presente: {
    type: Boolean,
    default: false,
  },
});

const Asistencia = mongoose.model("Asistencia", asistenciaSchema);

module.exports = Asistencia;