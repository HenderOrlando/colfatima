'use strict';

/**
 * @ngdoc function
 * @name colfatimaApp.controller:EncuestaCtrl
 * @description
 * # EncuestaCtrl
 * Controller of the colfatimaApp
 */
angular.module('colfatimaApp')
  .controller('EncuestaCtrl', function (Model, $stateParams, $rootScope, $mdToast, $timeout) {
    var
      vm = this,
      Encuesta = Model.getNew('encuesta'),
      Curso = Model.getNew('curso'),
      Pregunta = Model.getNew('pregunta'),
      Recurso = Model.getNew('recurso'),
      Area = Model.getNew('area'),
      Docente = Model.getNew('docente'),
      Estudiante = Model.getNew('estudiante'),
      encuestaid = $stateParams.encuesta,
      cursoEstudiante = $stateParams.curso,
      codigoEstudiante = $stateParams.estudiante,
      area = $stateParams.area,
      docente = $stateParams.docente,
      respuestaestudiante = Model.getNew('respuestaestudiante')
    ;
    vm.area = {};
    vm.curso = {};
    vm.docente = {};
    vm.encuesta = {};
    vm.estudiante = {};
    vm.preguntas = [];
    vm.recursos = [];
    vm.otrorecurso = '';
    vm.rtaSelected= rtaSelected;
    vm.createRecurso= createRecurso;
    vm.hasPresented = hasPresented;
    vm.saveRespuesta = saveRespuesta;
    vm.filterRecurso = filterRecurso;

    $rootScope.encuestaIniciada = true;

    Area.findOne(area).then(function(area){
      vm.area = area;
    });
    Docente.findOne(docente).then(function(docente){
      vm.docente = docente;
    });

    Encuesta.findOne(encuestaid).then(function(encuesta){
      vm.encuesta = encuesta;
      vm.preguntas = encuesta.preguntas;
      for(var h = 0; h < vm.preguntas.length; h++){
        populatePregunta(h);
      }
      Curso.findOne(cursoEstudiante).then(function(curso){
        vm.curso = curso;
        vm.estudiante = curso.estudiantes.filter(function(estudiante){
          return estudiante.codigo === codigoEstudiante;
        })[0];
        loadEstudiante();
        //console.log(vm.encuesta, vm.curso, vm.estudiante, vm.preguntas)
      })
    });

    loadRecurso();

    function populatePregunta(i){
      return Pregunta.findOne(vm.preguntas[i].id).then(function(pregunta){
        vm.preguntas[i] = pregunta;
      });
    }

    function loadEstudiante(){
      return Estudiante.findOne(vm.estudiante.id).then(function(est){
        vm.estudiante = est;
      });
    }

    function loadRecurso(){
      return Recurso.find().then(function(recursos){
        vm.recursos = recursos;
      });
    }

    function createRecurso(pregunta){
      var addRecurso = vm.otrorecurso;
      if(addRecurso.indexOf(',') > -1){
        addRecurso = addRecurso.split(',').map(function(rec){
          return {
            nombre: rec
          };
        });
      }else{
        addRecurso = [{nombre: addRecurso}];
      }
      Recurso.create(addRecurso).then(function(rta){
        loadRecurso();
        for(var h = 0; h < rta.length; h++){
          saveRespuesta(pregunta, rta[h])
        }
      });
    }

    function saveRespuesta(pregunta, respuesta){
      vm.disabled = true;
      var
        rta = null,
        promise = null
      ;
      if(pregunta.hasRecursos){
        rta = rtaSelected(pregunta, respuesta);
        if(!rta){
          promise = respuestaestudiante
            .create({
              recurso: respuesta.id,
              pregunta: pregunta.id,
              encuesta: vm.encuesta.id,
              estudiante: vm.estudiante.id,
              docente: vm.docente.id,
              area: vm.area.id
            })
            .then(function(rta) {
              return 'Respuesta guardada';
            })
          ;
        }else{
          promise = respuestaestudiante
            .findOne(rta.id)
            .then(function(rta) {
              return rta
                .$destroy()
                .then(function () {
                  return 'Respuesta actualizada';
                });
            });
        }
      }else{
        rta = hasPresented(pregunta, respuesta);
        //console.log(rta)
        if(!rta){
          promise = respuestaestudiante.create({
            respuesta: respuesta.id,
            pregunta: pregunta.id,
            encuesta: vm.encuesta.id,
            estudiante: vm.estudiante.id,
            docente: vm.docente.id,
            area: vm.area.id
          }).then(function(rta){
            return 'Respuesta guardada';
          });
        }else{
          rta.respuesta = respuesta.id;
          promise = respuestaestudiante
            .findOne(rta.id)
            .then(function(rta){
              rta.respuesta = respuesta.id;
              return rta
                .$update()
                .then(function(rta) {
                  return 'Respuesta actualizada';
                });
              });
        }
      }
  
      promise
        .then(function(msg){
          return loadEstudiante()
            .then(function() {
              showToast(msg);
              vm.disabled = false;
            })
          ;
        }, function(err){
          console.error(err)
          vm.disabled = false;
          showToast('No se guardó tu respuesta, intenta en unos segundos.');
        })
      ;
      /*console.log(respuesta)
      console.log(pregunta)
      console.log(vm.encuesta)
      console.log(vm.estudiante)
      console.log(vm.docente)
      console.log(vm.area)*/
    }

    function hasPresented(pregunta, respuesta){
      //console.log(vm.estudiante);
      var respuestas = vm.estudiante.respuestas || [];
      return respuestas.filter(function(rta){
        return rta.area === vm.area.id &&
            rta.docente === vm.docente.id &&
            rta.estudiante === vm.estudiante.id &&
            rta.encuesta === vm.encuesta.id &&
            rta.pregunta === pregunta.id
            //&& rta.respuesta === respuesta.id
        ;
      })[0];
    }

    function rtaSelected(pregunta, respuesta){
      //console.log(vm.estudiante);
      var respuestas = vm.estudiante.respuestas || [];
      return respuestas.filter(function(rta){
        var rtaSelected = rta.respuesta === respuesta.id;
        if(pregunta.hasRecursos){
          rtaSelected = rta.recurso === respuesta.id;
        }
        return rta.area === vm.area.id &&
          rta.docente === vm.docente.id &&
          rta.estudiante === vm.estudiante.id &&
          rta.encuesta === vm.encuesta.id &&
          rta.pregunta === pregunta.id &&
          rtaSelected
        ;
      })[0];
    }

    var msgTmp = '', time = null;
    function showToast(msg){
      if(msg !== msgTmp){
        $mdToast.show(
          $mdToast.simple()
            .textContent(msg)
            .position('top right')
            .hideDelay(3000)
        );
        resetTime();
      }else{
        resetTime();
      }
      msgTmp = msg;
      
      function resetTime(){
        if(time){
          $timeout.cancel(time);
        }
        time = $timeout(function(){
          msgTmp = '';
        }, 1500)
      }
    }

    function filterRecurso(item, index, list){
      if(vm.otrorecurso.length > 0 && item.nombre){
        return _.kebabCase(_.deburr(item.nombre)).indexOf(_.kebabCase(_.deburr(vm.otrorecurso))) > -1;
      }
      return true;
    }

  });
