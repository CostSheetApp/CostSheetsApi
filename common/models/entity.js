'use strict';

module.exports = function(Entity) {
  var app = require('../../server/server');

  Entity.afterRemote('create', function(ctx, entity, next) {
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
    if (ctx.isNewInstance) {
      if (ctx.instance) {
        ctx
          .instance
          .unsetAttribute('password');
      } else {
        delete ctx.data.password;
      }
    }
    entity.unsetAttribute('password');
    // delete entity.password;
    User.create(newUser, function(err, user) {
      if (err) {
        console.log(err);
        Entity.deleteById(entity.id);
        return next(err);
      }
    });
    next();
  });
};
