'use strict';

module.exports = function(Entity) {
  var seed = require('../../server/seed/seed.js');
  var regions = require('../../server/seed/data/Region.js');
  var jobs = require('../../server/seed/data/Job.js');

  Entity.observe('after save', function(ctx, next) {

    if (ctx.isNewInstance != undefined && ctx.isNewInstance) {
      var entity = ctx.instance;

      seed.AddRegions(Entity.app.models.Region,regions.map(function(o){o.entityId=entity.id; return o;}));
      seed.AddJobs(Entity.app.models.Job,jobs.map(function(o){o.entityId=entity.id; return o;}));

      var User = Entity.app.models.Account; // works!
      var newUser = {
        name: entity.name,
        isEnabled: true,
        username: entity.username,
        password: entity.password,
        email: entity.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        entityId: entity.id,
      };
      ctx.instance.unsetAttribute('password');
      entity.unsetAttribute('password');
      User.create(newUser, function(err, user) {
        if (err) {
          console.log(err);
          Entity.deleteById(entity.id);
          return next(err);
        }
        next();
      });
    } else {
      next();
    }


  });
};
