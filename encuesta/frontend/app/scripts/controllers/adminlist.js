'use strict';

/**
 * @ngdoc function
 * @name colfatimaApp.controller:AdminlistCtrl
 * @description
 * # AdminlistCtrl
 * Controller of the colfatimaApp
 */
angular.module('colfatimaApp')
  .controller('AdminListCtrl', function ($stateParams, Model, $q) {
    var
      vm = this,
      modelname = $stateParams.model,
      model = Model.getAttrsModel(modelname)
    ;

    vm.list = [];
    vm.selected = [];
    vm.getList = getList;
    vm.promise = getList();
    vm.attrs = {};
    vm.showlist = true;
    vm.toggleShowList = toggleShowList;
    vm.getSelectedIds = getSelectedIds;
    vm.destroy = destroy;
    
    vm.resources = {
      list: [
        {
          title: '',
          route: '',
          icon: ''
        }
      ]
    };

    function toggleShowList(){
      vm.showlist = !vm.showlist;
    }

    function init(){
      return model.then(function(model){
        return model.attrs().then(function(attrs){
          vm.attrs = attrs;
          return model;
        });
      });
    }

    function getSelectedIds(){
      return vm.selected.map(function(val){
        return val.id;
      });
    }

    function getList(){
      return init().then(function(model){
        model.find({
          sort: 'nombre ASC'
        }).then(function(list){
          vm.list = list
          return list;
        });
      });
    }

    function destroy(){
      init().then(function(model){
        for(var h = 0; h < vm.selected.length; h++){
          model.destroy(vm.selected[h].id).then(function(rta){
            vm.selected.splice(h,1);
            console.log(rta);
          });
        }
      })
    }
  });
