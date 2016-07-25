'use strict';

/**
 * @ngdoc function
 * @name colfatimaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the colfatimaApp
 */
angular.module('colfatimaApp')
  .controller('AdminCtrl', function ($http, Model, $q, $mdToast) {
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
      datasetOverride: {},
      general: {
        type: 'Bar',
        data: [],
        series: [],
        labels: [],
        options: {},
        datasetOverride: {}
      }
    };
    vm.usr = {};

    vm.loadSelectedDocente = loadSelectedDocente;
    vm.loadSelectedGrado = loadSelectedGrado;
    vm.loadSelectedCurso = loadSelectedCurso;
    vm.loadSelectedArea = loadSelectedArea;
    vm.getEstadistica = getEstadistica;
    vm.getHeaderTable = getHeaderTable;
    vm.estadistica = estadistica;
    vm.toggleShow = toggleShow;
    vm.getTable = getTable;
    vm.entrar = entrar;

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
      vm.docente = {};
      loadSelectedItem('area');
    }

    function loadSelectedDocente(){
      vm.area = {};
      loadSelectedItem('docente');
    }

    function loadSelectedItem(name){
      if(vm[name]){
        if(vm[name].id){
          var query = {};
          if(vm.area && vm.area.id){
            query.area = vm.area.id;
          }else if(vm.docente && vm.docente.id){
            query.docente = vm.docente.id;
          }
        }else{
          if(vm[name].nombre === 'Todos'){
            vm[name] = {};
          }
        }
      }else{
        vm[name] = {};
      }
      getDataGraph();
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
      var labelsgeneral = {};
      vm.graph.general.options = {};
      _.forEach(vm.encuesta.preguntas, function(preg, i){
        var
          est = getEstadistica(preg),
          serie = [],
          labels = [],
          type = 'Bar'
        ;
        vm.graph.datasetOverride[preg.id] = [];
        vm.graph.type[preg.id] = type;
        vm.graph.labels[preg.id] = labels;
        vm.graph.series[preg.id] = [];
        vm.graph.data[preg.id] = [];
        /*vm.graph.datasetOverride[preg.id] = vm.graph.datasetOverride[preg.id] || [];
        vm.graph.type[preg.id] = vm.graph.type[preg.id] || 'Bar';
        vm.graph.labels[preg.id] = vm.graph.labels[preg.id] || [];
        vm.graph.series[preg.id] = vm.graph.series[preg.id] || [];
        vm.graph.data[preg.id] = vm.graph.data[preg.id] || [];*/
        vm.graph.options[preg.id] = vm.graph.options[preg.id] || {
            responsive: false,
            legend: {
              display: true,
              position: 'bottom'
            },
            title: {
              display: true,
              position: 'top',
              text: preg.enunciado
            },
            showTooltips: false,
            onAnimationComplete: function () {
              var data = this.datasets || this.segments;
              if(data[0] && data[0].bars){
                data = data[0].bars;
              }
              this.showTooltip(data, true);
            }
          };
        /*if(!est){
         }*/
        if(preg.opciones && preg.opciones.length > 0){
          vm.graph.general.labels.push((i + 1) + '. ' + _.truncate(preg.enunciado));
          _.forEach(preg.opciones, function(opt){
            //console.log(preg.enunciado, ' - ', opt.enunciado, '(',opt.id,') => ',est[opt.id])
            var value = (est && est[opt.id]) || 0;
            serie.push(value);
            labelsgeneral[opt.id] = labelsgeneral[opt.id] || [];
            labelsgeneral[opt.id].push(value);
            labels.push(_.truncate(opt.enunciado));
            /*if(vm.graph.series[preg.id].length < 1){
              labels.push(opt.enunciado);
            }*/
          });
          if(vm.graph.general.series.length < 1){
            vm.graph.general.series = labels;
          }
        }else{
          type = 'Pie';
          _.forEach(vm.recursos, function(opt){
            var
              val = (est && est[opt.id]) || 0,
              percent = est && est.total && est.total > 0?Math.round((val / est.total) * 100):0
              ;
            //console.log(est[opt.id])
            serie.push(val);
            labels.push(opt.nombre + ' (' + percent + '%)');
            /*if(vm.graph.series[preg.id].length < 1){
              labels.push(opt.nombre + ' (' + percent + '%)');
            }*/
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
      vm.graph.general.data = _.values(labelsgeneral);
      //console.log(vm.graph)
    }

    function entrar(){
      vm.usr.login = vm.usr.email === 'aura_bonett@hotmail.com' && vm.usr.clave === 'hijos8793';
      var toast = $mdToast.simple()
        .textContent(vm.usr.login?'Binevenido':'Usuario o clave errónea')
          .position('top right')
      ;
      $mdToast.show(toast)

    }

    function getHeaderTable(preg){
      var header = ['pregunta'];
      if(preg && preg.opciones && preg.opciones.length > 0){
        _.forEach(preg.opciones, function(opt){
          header.push(opt.enunciado);
          header.push(opt.enunciado + '%');
        });
        header.push('total');
      }else{
        header = getHeaderTable(vm.encuesta.preguntas[0]);
      }
      return header;
    }

    function getTable(preg){
      var
        tabla = [],
        est = null,
        row = {}
      ;
      if(preg){
        if(preg.opciones && preg.opciones.length > 0){
          est = getEstadistica(preg);
          row['pregunta'] = preg.enunciado;
          _.forEach(preg.opciones, function(opt){
            row[opt.enunciado] = (est && est[opt.id]) || 0;
            if(est.total > 0){
              row[opt.enunciado + '%'] = ((row[opt.enunciado] / est.total) * 100).toFixed(2) + '%';
            }else{
              row[opt.enunciado + '%'] = 0 + '%';
            }
          });
          row.total = est.total;
          tabla.push(row);
        }
      }else {
        var total = 0;
        _.forEach(vm.encuesta.preguntas, function(preg){
          if(preg.opciones && preg.opciones.length > 0){
            row[preg.enunciado] = getTable(preg)[0];
            total += row[preg.enunciado].total;
          }
        });
        /*var headers = getHeaderTable(vm.encuesta.preguntas[0]);
        headers[headers.length] = total;
        row.total = headers;*/
        tabla = _.values(row);
      }
      //console.log(tabla);
      return tabla;
    }

    /*$http.post(url + 'encuesta/create', {
      titulo: 'Encuesta a Estudiantes',
      ayuda: 'Para la institución es importante conocer tu opinión como estudiante sobre la práctica docente. A continación se presentan una serie de aspectos que nos permitirán evaluarnos y mejorar cada día más, por lo tanto el diligenciamiento de ésta encuesta se debe contestar con la mayor sinceridad posible. Marca con una x la respuesta que se ajusta a tu sentir.'
    }).then(function(encuesta){
      console.log(encuesta);
    });*/
  });
