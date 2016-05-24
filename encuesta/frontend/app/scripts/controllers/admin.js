'use strict';

/**
 * @ngdoc function
 * @name colfatimaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the colfatimaApp
 */
angular.module('colfatimaApp')
  .controller('AdminCtrl', function ($http, Model) {
    var
      vm = this
    ;
    vm.models = {};

    Model.getAttrs().then(function(data){
      angular.forEach(data, function(model, key){
        vm.models[key] = Model.getNew(key);
      });
    });

    /*$http.post(url + 'encuesta/create', {
      titulo: 'Encuesta a Estudiantes',
      ayuda: 'Para la institución es importante conocer tu opinión como estudiante sobre la práctica docente. A continación se presentan una serie de aspectos que nos permitirán evaluarnos y mejorar cada día más, por lo tanto el diligenciamiento de ésta encuesta se debe contestar con la mayor sinceridad posible. Marca con una x la respuesta que se ajusta a tu sentir.'
    }).then(function(encuesta){
      console.log(encuesta);
    });*/
  });
