/**
 * Grado.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    nombre: {
      type: 'string'
    },
    codigo: {
      type: 'string'
    },
    colegio: {
      model: 'colegio'
    },
    cursos: {
      collection: 'curso',
      via: 'grado'
    }
  }
};

