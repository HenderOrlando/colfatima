/**
 * Respuestaestudiante.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    respuesta: {
      model: 'respuesta'
    },
    pregunta: {
      model: 'pregunta'
    },
    encuesta: {
      model: 'encuesta'
    },
    estudiante: {
      model: 'estudiante'
    },
    docente: {
      model: 'docente'
    },
    area: {
      model: 'area'
    },
    recurso: {
      model: 'recurso'
    },
    jornada: {
      type: 'string',
      enum: ['mañana', 'tarde']
    }
  }
};

