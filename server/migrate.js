var path = require('path');
var app = require(path.resolve (__dirname, './server'));
//var models = app.models;
var ds = app.dataSources.MySql;
//console.log(models)
var models = ['Account', 'AccessToken', 'ACL', 'RoleMapping', 'Role','Entity','Project','CostSheet','EntityHasProjects','EntityHasCostSheets','ProjectHasCostSheets'];


var migrate = true;


if(migrate){
  ds.automigrate(models, function(err) {
      if (err) throw err;

      

      console.log('Loopback tables [' + models + '] created in ', ds.adapter.name);
      ds.disconnect();
    });
}else{
  ds.isActual(models, function(err, actual) {
  if (!actual) {
    ds.autoupdate(models, function(err) {
      if (err) throw (err);

      console.log('Loopback tables [' + models + '] updated in ', ds.adapter.name);
      ds.disconnect();
    });
  }
});
}



