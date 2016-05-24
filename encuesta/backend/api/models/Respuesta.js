/**
 * Respuesta.js
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
    preguntas: {
      collection: 'pregunta',
      via: 'opciones'
    },
    respuestas: {
      collection: 'respuestaestudiante',
      via: 'respuesta'
    }
  }
};

