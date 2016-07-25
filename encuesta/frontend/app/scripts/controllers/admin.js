'use strict';

/**
 * @ngdoc function
 * @name colfatimaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the colfatimaApp
 */
angular.module('colfatimaApp')
  .controller('AdminCtrl', function ($http, Model, $q) {
    var
      vm = this,
      Area = Model.getNew('area'),
      Grado = Model.getNew('grado'),
      Curso = Model.getNew('curso'),
      Colegio = Model.getNew('colegio'),
      Docente = Model.getNew('docente'),
      Recurso = Model.getNew('recurso'),
      Encuesta = Model.getNew('encuesta'),
      Pregunta = Model.getNew('pregunta'),
      Respuesta = Model.getNew('respuesta'),
      RespuestaEstudiante = Model.getNew('respuestaestudiante'),
      modelSelect = {
        area: Area,
        grado: Grado,
        curso: Curso,
        docente: Docente
      },
      optAll = {
        nombre: 'Todos'
      }
    ;
    vm.estadisticas = {};
    vm.models = {};
    vm.colegio = {};
    vm.grados = [optAll];
    vm.grado = {};
    vm.cursos = [optAll];
    vm.curso = {};
    vm.areas = [optAll];
    vm.area = {};
    vm.docentes = [optAll];
    vm.recursos = [];
    vm.docente = {};
    vm.encuesta = {};
    vm.respuestasestudiantes = [];
    vm.respuestas = {
      areas: {},
      docentes: {}
    };
    //vm.show = 'table';
    vm.show = 'graph';
    vm.graph = {
      //type: 'Line',
      //type: 'Bar',
      //type: 'HorizontalBar',
      //type: 'Radar',
      //type: 'Pie',
      //type: 'PolarArea',
      //type: 'Doughnut',
      //type: 'Bubble',
      type: {},
      data: {},
      series: {},
      labels: {},
      options: {},
      datasetOverride: {}
    };

    vm.loadSelectedDocente = loadSelectedDocente;
    vm.loadSelectedGrado = loadSelectedGrado;
    vm.loadSelectedCurso = loadSelectedCurso;
    vm.loadSelectedArea = loadSelectedArea;
    vm.estadistica = estadistica;
    vm.toggleShow = toggleShow;

    /*Model.getAttrs().then(function(data){
      angular.forEach(data, function(model, key){
        vm.models[key] = Model.getNew(key);
      });
    });*/

    Area.find().then(function(areas){
      vm.areas = vm.areas.concat(areas);
      Docente.find().then(function(docentes){
        vm.docentes = vm.docentes.concat(docentes);
        Recurso.find().then(function(recursos){
          vm.recursos = recursos;
          Colegio.find().then(function(colegios){
            vm.colegio = colegios[0];
            vm.grados = vm.grados.concat(vm.colegio.grados);
            Encuesta.findOne(vm.colegio.encuestas[0].id).then(function(encuesta){
              Pregunta.find({
                where: {
                  id: encuesta.preguntas.map(function(pregunta){
                    return pregunta.id;
                  })
                }
              }).then(function(preguntas){
                encuesta.preguntas = preguntas;
                vm.encuesta = encuesta;
                getEstadisticas();
              });
            });
            Curso.find({
              where: {
                colegio: vm.colegio
              }
            }).then(function(cursos){
              vm.cursos = vm.cursos.concat(cursos);
            });
          });
        });
      });
    });


    function getEstadisticas(){
      var
        preguntas = vm.encuesta.preguntas,
        estudiantes = [],
        h = 0
      ;
      for(h = 0; h < preguntas.length; h++){
        preguntas[h].estadistica = preguntas[h].estadistica || {};
        preguntas[h].estadistica.total = preguntas[h].estadistica.total || 0;
        preguntas[h].estadistica.areas = preguntas[h].estadistica.areas || {};
        preguntas[h].estadistica.docentes = preguntas[h].estadistica.docentes || {};
        preguntas[h].estadistica.respuestas =  preguntas[h].estadistica.respuestas || {};
        preguntas[h].estadistica.estudiantes =  preguntas[h].estadistica.estudiantes || {}
        var
          areas = {},
          docentes = {},
          respuestas = {},
          students = {}
        ;
        preguntas[h].respuestas = preguntas[h].respuestas.filter(function(rta){
          var exist = estudiantes.indexOf(rta.estudiante + rta.pregunta) > -1;
          estudiantes.push(rta.estudiante + rta.pregunta);
          if(!exist){
            areas[rta.area] = areas[rta.area] || {};
            areas[rta.area].total = areas[rta.area].total || 0;
            areas[rta.area][rta.respuesta || rta.recurso] = areas[rta.area][rta.respuesta || rta.recurso] || 0;
            areas[rta.area][rta.respuesta || rta.recurso]++;
            areas[rta.area].total++;

            docentes[rta.docente] = docentes[rta.docente] || {};
            docentes[rta.docente].total = docentes[rta.docente].total || 0;
            docentes[rta.docente][rta.respuesta || rta.recurso] = docentes[rta.docente][rta.respuesta || rta.recurso] || 0;
            docentes[rta.docente][rta.respuesta || rta.recurso]++;
            docentes[rta.docente].total++;

            respuestas[rta.respuesta || rta.recurso] = respuestas[rta.respuesta || rta.recurso] || 0;
            respuestas.total = respuestas.total || 0;
            respuestas[rta.respuesta || rta.recurso]++;
            respuestas.total++;

            students[rta.estudiante] = students[rta.estudiante] || {};
            students[rta.estudiante].total = students[rta.estudiante].total || 0;
            students[rta.estudiante][rta.respuesta || rta.recurso] = students[rta.estudiante][rta.respuesta || rta.recurso] || 0;
            students[rta.estudiante][rta.respuesta || rta.recurso]++;
            students[rta.estudiante].total++;
          }
          return !exist;
        });
        preguntas[h].estadistica.total = preguntas[h].respuestas.length;
        preguntas[h].estadistica.areas = areas;
        preguntas[h].estadistica.docentes = docentes;
        preguntas[h].estadistica.respuestas = respuestas;
        preguntas[h].estadistica.estudiantes = students;
        //console.log(preguntas[h].estadistica)
      }
      //console.log(preguntas)
      getDataGraph();
    }

    function toggleShow(show){
      if(show){
        vm.show = show;
      }else{
        vm.show = vm.show === 'table'?'graph':'table';
      }
    }

    function loadSelectedGrado(){
      loadSelectedItem('grado');
    }

    function loadSelectedCurso(){
      loadSelectedItem('curso');
    }

    function loadSelectedArea(){
      loadSelectedItem('area');
    }

    function loadSelectedDocente(){
      loadSelectedItem('docente');
    }

    function loadSelectedItem(name){
      if(vm[name]){
        if(vm[name].id){
          var query = {};
          if(vm.area && vm.area.id){
            query.area = vm.area.id;
          }
          if(vm.docente && vm.docente.id){
            query.docente = vm.docente.id;
          }
        }else{
          if(vm[name].nombre === 'Todos'){
            vm[name] = {};
          }
        }
        getDataGraph();
      }else{
        vm[name] = {};
      }
    }

    function estadistica(pregunta, rta, total){
      var
        est = getEstadistica(pregunta),
        value = 0
      ;
      if(est && est.total){
        if(total){
          value = est.total;
        }
        if(rta){
          value = est[rta.id];
        }
      }else{
        est = est || {};
        if(rta && rta.id)
        est[rta.id] = 0;
        est.total = 0;
      }
      var percent = est.total > 0?Math.round((value / est.total) * 100):0;
      value = value || 0;
      percent = percent || 0;
      return value + '(' + percent + '%' + ')';
    }

    function getEstadistica(pregunta){
      var est = pregunta.estadistica.respuestas || {};
      if(vm.area && vm.area.id){
        est = pregunta.estadistica.areas[vm.area.id];
        //console.log(vm.area.id, ' => ',est)
      }else if(vm.docente && vm.docente.id){
        est = pregunta.estadistica.docentes[vm.docente.id];
        //console.log(vm.docente.id, ' => ',est)
      }
      return est;
    }

    function getDataGraph(){
      _.forEach(vm.encuesta.preguntas, function(preg){
        vm.graph.datasetOverride[preg.id] = vm.graph.datasetOverride[preg.id] || [];
        vm.graph.type[preg.id] = vm.graph.type[preg.id] || 'Bar';
        vm.graph.labels[preg.id] = vm.graph.labels[preg.id] || [];
        vm.graph.series[preg.id] = vm.graph.series[preg.id] || [];
        vm.graph.data[preg.id] = vm.graph.data[preg.id] || [];
        vm.graph.options[preg.id] = vm.graph.options[preg.id] || {
            legend: {
              display: true,
              position: 'bottom'
            },
            title: {
              display: true,
              position: 'top',
              text: preg.enunciado
            }
          };

        var
          serie = [],
          labels = vm.graph.labels[preg.id] || [],
          est = getEstadistica(preg),
          type = 'Bar'
        ;
        if(preg.opciones && preg.opciones.length > 0){
          _.forEach(preg.opciones, function(opt){
            var val = (est && est[opt.id]) || 0;
            serie.push(val);
            if(vm.graph.series[preg.id].length < 1){
              labels.push(opt.enunciado);
            }
          });
        }else{
          type = 'Pie';
          _.forEach(vm.recursos, function(opt){
            var
              val = (est && est[opt.id]) || 0,
              percent = est.total && est.total > 0?Math.round((val / est.total) * 100):0
              ;
            serie.push(val);
            if(vm.graph.series[preg.id].length < 1){
              labels.push(opt.nombre + ' (' + percent + '%)');
            }
          });
        }

        if(vm.graph.series[preg.id].length < 1){
          vm.graph.series[preg.id].push(preg.enunciado);
          vm.graph.datasetOverride[preg.id].push({
            label: preg.enunciado,
            borderWidth: 1,
            type: type
          });
          vm.graph.type[preg.id] = type;
        }

        vm.graph.labels[preg.id] = labels;

        if(vm.graph.type[preg.id] !== 'Pie'){
          serie = [serie];
        }
        vm.graph.data[preg.id] = serie;
      });
      console.log(vm.graph)
    }

    /*$http.post(url + 'encuesta/create', {
      titulo: 'Encuesta a Estudiantes',
      ayuda: 'Para la institución es importante conocer tu opinión como estudiante sobre la práctica docente. A continación se presentan una serie de aspectos que nos permitirán evaluarnos y mejorar cada día más, por lo tanto el diligenciamiento de ésta encuesta se debe contestar con la mayor sinceridad posible. Marca con una x la respuesta que se ajusta a tu sentir.'
    }).then(function(encuesta){
      console.log(encuesta);
    });*/
  });
