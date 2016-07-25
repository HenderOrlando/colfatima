'use strict';

/**
 * @ngdoc service
 * @name colfatimaApp.Model
 * @description
 * # Model
 * Service in the colfatimaApp.
 */
angular.module('colfatimaApp')
  .service('Model', function ($http, $q) {
    var models = null;

    return {
      getNew: getNew,
      getAttrs: getAttrs,
      getAttrsModel: getAttrsModel
    };

    function getNew(modelname, data){
      return new Model(modelname, data);
    }

    function getAttrs(force){
      /*if(!!models && !force){
        return models;
      }*/
      return $q(function(resolve, reject){
        //$http.get('http://104.236.247.198/admin/attributes/lista')
        $http.get('http://localhost:1337/admin/attributes/lista')
          .then(function(data){
            models = {};
            data = data.data;
            angular.forEach(data, function(model, key){
              models[key] = new Model(key);
            });
            resolve(models);
          }, reject);
      });
    }

    function getAttrsModel(modelname, force){
      return $q(function(resolve, reject){
        getAttrs(force).then(function(){
          resolve(models[modelname]);
        }, reject);
      });
    }

    function Model (modelname, data){
      data = data || null;
      var
        //url = 'http://104.236.247.198',
        url = 'http://localhost:1337',
        urladmin = url + '/admin',
        urlattrs = urladmin + '/attributes',
        obj = {
          $modelname: modelname,
          $destroy: $destroy,
          $create: $create,
          $update: $update,
          $find: $find,
          $add: $add,
          $remove: $remove,
          $attrs: $attrs,
          $populate: $populate,
          toJSON: toJSON
        }
      ;

      if(data){
        obj = angular.merge({}, obj, data);
        return obj;
      }else{
        return {
          modelname: modelname,
          findOne: findOne,
          destroy: destroy,
          create: create,
          update: update,
          find: find,
          add: add,
          remove: remove,
          attrs: attrs,
          populate: populate
        }
      }

      function $attrs(){
        return attrs();
      }
      function attrs(){
        return $http.get(urlattrs + '/' + modelname)
          .then(getResolve, getReject)
          ;
      }

      function $create(){
        return create(obj.toJSON());
      }
      function create(data){
        return $http.post(url + '/' + modelname + '/create', data)
          .then(getResolve, getReject)
          ;
      }

      function $update(){
        return update(obj.id, obj.toJSON());
      }
      function update(modelid, data){
        return $http.put(url + '/' + modelname + '/update/' + modelid, data)
          .then(getResolve, getReject)
          ;
      }

      function $destroy(){
        return destroy(obj.id);
      }
      function destroy(modelid){
        modelid = modelid || obj.id;
        return $http.delete(url + '/' + modelname + '/' + modelid)
          .then(getResolve, getReject)
          ;
      }

      function findOne(modelid){
        modelid = modelid || obj.id;
        return $http.get(url + '/' + modelname + '/' + modelid)
          .then(getResolve, getReject)
          ;
      }

      function $find(where) {
        return find(where);
      }
      function find(where){
        where = where || {};
        return $http.get(url + '/' + modelname, where)
          .then(getResolve, getReject)
          ;
      }

      function $populate(associationname){
        return populate(obj.id, associationname);
      }
      function populate(modelid, associationname){
        modelid = modelid || obj.id;
        return $http.get(url + '/' + modelname + '/' + modelid + '/' + associationname)
          .then(getResolve, getReject)
          ;
      }

      function $add(associationname, associationid){
        return add(obj.id, associationname, associationid);
      }
      function add(modelid, associationname, associationid){
        modelid = modelid || obj.id;
        return $http.post(url + '/' + modelname + '/' + modelid + '/' + associationname + '/' + associationid)
          .then(getResolve, getReject)
          ;
      }

      function $remove(associationname, associationid){
        return remove(obj.id, associationname, associationid);
      }
      function remove(modelid, associationname, associationid){
        modelid = modelid || obj.id;
        return $http.delete(url + '/' + modelname + '/' + modelid + '/' + associationname + '/' + associationid)
          .then(getResolve, getReject)
          ;
      }

      function toJSON(){
        var
          este = this,
          json = angular.merge({}, este)
          ;
        angular.forEach(este, function(val, key){
          if(key.indexOf('$') > -1){
            delete json[key];
          }
        });
        return json;
      }

      function getResolve(response){
        var data = response.data;
        /*var
         config = response.config,
         headers = response.headers,
         status = response.status,
         statusText = response.statusText,
         data= response.data
         ;*/
        if(angular.isArray(data)){
          data = data.map(function(val, key){
            val = mergeFunctions(val);
            return val;
          });
        }else if(angular.isObject(data) && angular.isString(data.id)){
          data = mergeFunctions(data);
        }
        response.data = data;
        if(response.status === 200 || response.status === 201){
          return response.data;
        }
        return response;
      }

      function getReject(error){
        return error;
      }

      function mergeFunctions(val){
        //val = angular.merge({}, val, new Obj(val));
        val = new Model(modelname, val);
        if(val.id){
          delete val.$create;
        }
        return val;
      }
    }
  });
