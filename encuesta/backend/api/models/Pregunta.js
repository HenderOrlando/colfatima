/**
 * Pregunta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    enunciado: {
      type: 'text'
    },
    ayuda: {
      type: 'text'
    },
    encuesta: {
      model: 'encuesta'
    },
    opciones: {
      collection: 'respuesta',
      via: 'preguntas',
      dominant: true
    },
    respuestas: {
      collection: 'respuestaestudiante',
      via: 'pregunta'
    },
    hasRecursos: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};

