/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	attributes: function (req, res){
    var
      modelname = req.params.model,
      model = null,
      blackAttrs = ['id', 'updatedAt', 'createdAt']
    ;
    if(modelname === 'lista'){
      model = {};
      _.forEach(sails.models, function(attr, key){
        if(attr){
          model[key] = attr._attributes;
          blackAttrs.filter(function(attrname){
            delete model[key][attrname];
          });
        }
      });
    }else{
      if(sails.models[modelname]){
      model = sails.models[modelname]._attributes;
        blackAttrs.filter(function(attrname){
          delete model[attrname];
        });
      }
    }

    res.json(model);
  }
};

