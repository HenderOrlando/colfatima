'use strict';

/**
 * @ngdoc function
 * @name colfatimaApp.controller:AdminformCtrl
 * @description
 * # AdminformCtrl
 * Controller of the colfatimaApp
 */
angular.module('colfatimaApp')
  .controller('AdminFormCtrl', function ($stateParams, Model, $q) {
    var
      vm = this,
      modelname = $stateParams.model,
      modelid = $stateParams.id,
      model = Model.getAttrsModel(modelname)
      ;

    vm.save = save;
    vm.attrs = {};
    vm.list = [];

    vm.searchText = {};
    vm.selectedItem = [];
    vm.querySearch = querySearch;
    vm.searchTextChange = searchTextChange;
    vm.selectedItemChange = selectedItemChange;

    vm.searchTextChip = {};
    vm.selectedItemChip = [];
    vm.transformChip = transformChip;
    vm.querySearchChip = querySearchChip;
    vm.selectedItemChange = selectedItemChange;

    if(modelid === 'add'){
      init().then(function(){
        vm.list.push(Model.getNew(modelname, {}));
      });
    }else if(angular.isArray(JSON.parse(modelid))){
      modelid = JSON.parse(modelid);
      init().then(function(model){
        modelid.filter(function(id){
          model.findOne(id).then(function(item){
            vm.list.push(item);
          })
        });
      });
      // Consultar lista de items a editar
    }else{
      // Consultar item a editar
    }

    function init(){
      return model.then(function(model){
        return model.attrs().then(function(attrs){
          vm.attrs = attrs;
          //console.log(attrs)
          return model;
        });
      });
    }

    function searchTextChange($index){
      console.log(vm.searchText[$index])
    }

    function selectedItemChange(item){
      console.log(item)
    }

    function save(item, $index){
      console.log(item);
      var promise = null;
      if(item.id){
        promise = item.$update().then(function(rta){
          console.log(rta)
          return rta;
        });
      }else{
        promise = item.$create().then(function(rta){
          vm.list[$index] = Model.getNew(modelname, {});
          vm.searchText[$index] = '';
          return rta;
        });
      }
      promise.then(function(item){
        console.log(modelname + ' -> ', item);
        if(modelname === 'curso'){
          for(var h = 1; h <= item.cantidad; h++){
            checkEstudiante(item, Model.getNew('estudiante'), h);
          }
        }
      });
      function checkEstudiante(curso, estudiante, h){
        /*estudiante.find({
          where: {
            codigo: h
          },
          populate: {
            curso: {
              where: {
                id: curso.id
              }
            }
          }
        }).then(function(est){*/
          //console.log(est)
          //if(est.length <= 0){
            var model = Model.getNew('estudiante', {});
            model.nombre = 'Estudiante ' + h + ' Curso ' + curso.nombre;
            model.codigo = h;
            model.curso = curso.id;
            model.$create().then(function(est){
              console.log(est.nombre + ' creado!!');
            });
          //}
        //});
      }
    }

    function transformChip($chip){
      return $chip;
    }

    function querySearchChip(attr, $index){
      return querySearch(attr, vm.searchTextChip, $index);
    }

    function querySearch(attr, searchText, $index){
      searchText = searchText || vm.searchText;
      searchText = searchText[$index];
      return $q(function(resolve, reject){
        init().then(function(){
          //console.log(attr)
          if(searchText && searchText.length){
            if(attr.enum){
              return resolve(attr.enum.filter(function(val){
                return val.indexOf(searchText) > -1
              }));
            }else /*if(attr.model)*/{
              var attrmodel = Model.getNew(attr.model || attr.collection);
              return attrmodel
                .attrs()
                .then(function(attrs){
                  var where = {};
                  where.nombre = {
                    contains: searchText
                  };
                  /*angular.forEach(attrs, function(attr, name){
                    if(attr.type === 'string'){
                      where[name] = {
                        contains: searchText
                      };
                    }
                  });*/
                  return where;
                }, reject)
                .then(function(where){
                  return attrmodel.find({where: where}).then(function(list){
                    console.log(list)
                    if(angular.isArray(list)){
                      return resolve(list.filter(function(val){
                        var index = -1;
                        if(val.nombre){
                          index = val.nombre.indexOf(searchText);
                        }else if(val.titulo){
                          index = val.titulo.indexOf(searchText);
                        }else if(val.enunciado){
                          index = val.enunciado.indexOf(searchText);
                        }
                        return index > -1;
                      }));
                    }
                    resolve([]);
                  }, reject)
                })
                ;
            }
          }else{
            if(attr.enum){
              return resolve(attr.enum);
            }else if(attr.model){
              return Model.getNew(attr.model).find().then(function(list){
                return resolve(list);
              }, reject)
                ;
            }
          }
        });
      });
    }

  });
