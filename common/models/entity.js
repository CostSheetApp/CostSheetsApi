'use strict';

module.exports = function(Entity) {
  var app = require('../../server/server');

  Entity.observe('after save', function(ctx, next) {

    if (ctx.isNewInstance != undefined && ctx.isNewInstance) {
      var entity = ctx.instance;
      var User = app.models.Account; // works!
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
