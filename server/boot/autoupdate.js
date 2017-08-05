'use strict';

module.exports = function(app) {
  var path = require('path');
  var _env_ = "";
  if(process.env.NODE_ENV!=undefined)
    _env_ = process.env.NODE_ENV+".";
  console.log("_env_",_env_);
  var models = require(path.resolve(__dirname, `../model-config.${_env_}json`));
  var datasources = require(path.resolve(__dirname, `../datasources.${_env_}json`));

  function autoUpdateAll() {
    Object
      .keys(models)
      .forEach(function(key) {
        if (key == 'User') return;
        if (typeof models[key].dataSource != 'undefined') {
          if (typeof datasources[models[key].dataSource] != 'undefined') {
            app
              .dataSources[models[key].dataSource]
              .autoupdate(key, function(err) {
                if (err)
                  throw err;
                console.log('Model ' + key + ' updated');
              });
          }
        }
      });
  }

  function autoMigrateAll() {
    Object
      .keys(models)
      .forEach(function(key) {
        if (key == 'User')
          return;
        if (typeof models[key].dataSource != 'undefined') {
          if (typeof datasources[models[key].dataSource] != 'undefined') {
            app
              .dataSources[models[key].dataSource]
              .automigrate(key, function(err) {
                if (err)
                  throw err;
                console.log('Model ' + key + ' migrated');
              });
          }
        }
      });
  }
  // TODO: change to autoUpdateAll when ready for CI deployment to production
   autoMigrateAll(); 
  //autoUpdateAll();
};
