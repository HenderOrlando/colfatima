'use strict';

/**
 * @ngdoc function
 * @name colfatimaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the colfatimaApp
 */
angular.module('colfatimaApp')
  .controller('MainCtrl', function (Model, $state, $mdToast, $rootScope) {
    var
      vm = this,
      Colegio = Model.getNew('colegio'),
      Curso = Model.getNew('curso'),
      Docente = Model.getNew('docente'),
      Area = Model.getNew('area'),
      Estudiante = Model.getNew('estudiante')
    ;
    $rootScope.encuestaIniciada = false;

    vm.year = new Date().getFullYear();
    vm.area = null;
    vm.cursos = [];
    vm.docente = null;
    vm.colegio = {};
    vm.encuesta = {};
    vm.cursoEstudiante = '';
    vm.codigoEstudiante = '';
    vm.iniciarEncuesta = iniciarEncuesta;

    vm.getCodigos = getCodigos;

    Area.find().then(function(areas){
      vm.areas = areas;
    });

    Docente.find().then(function(docentes){
      vm.docentes = docentes;
    });

    Colegio.find().then(function(colegios){
      vm.colegio = colegios[0];
      vm.encuesta = vm.colegio.encuestas[0];
      Curso.find({
        where: {
          colegio: vm.colegio
        },
        populate: 'estudiantes'
      }).then(function(cursos){
        //console.log(cursos)
        vm.cursos = cursos;
      })
    });

    function iniciarEncuesta(){
      if(vm.codigoEstudiante && vm.cursoEstudiante && vm.docente && vm.area){
        var curso = vm.cursos.filter(function(curso){
          //console.log(curso)
          return curso.id === vm.cursoEstudiante;
        })[0];
        if(curso && curso.id && vm.codigoEstudiante > 0 && vm.codigoEstudiante <= curso.cantidad){
          $state.go('index.encuesta', {
            area: vm.area,
            docente: vm.docente,
            encuesta: vm.encuesta.id,
            curso: vm.cursoEstudiante,
            estudiante: vm.codigoEstudiante
          });
        }else{
          if(curso && curso.id){
            showToast('Estudiante no encontrado');
          }
        }
      }else{
        var
          msgs = [],
          msg = 'Por favor, verifica ';
        if(!vm.area){
          msgs.push('el area');
        }
        if(!vm.docente){
          msgs.push('el docente');
        }
        if(!vm.codigoEstudiante){
          msgs.push('el código');
        }
        if(!vm.cursoEstudiante){
          msgs.push('el curso');
        }
        showToast(msg + msgs.join(', '));
      }
    }

    function getCodigos(){
      var
        curso = vm.cursos.filter(function(curso){
          return curso.id === vm.cursoEstudiante
        })[0],
        codigos = []
        ;
      if(curso && curso.cantidad){
        for(var h = 1; h <= curso.cantidad; h++){
          codigos.push(h);
        }
      }
      return codigos;
    }

    function showToast(msg){
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .position('top right')
          //.hideDelay(3000)
      );
    }

  });
