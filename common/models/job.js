'use strict';

module.exports = function(Job) {
  Job.observe('before save', function(ctx, next) {
    var code = 1;
    var id = 0;
    if (ctx.isNewInstance) {
      if (ctx.instance) {
        id = ctx.instance.entityId;
      } else {
        id = ctx.data.entityId;
      }
      Job
        .find({
          where: {
            entityId: id,
          },
          order: 'code DESC',
          limit: 1,
          fields: {
            code: true,
          },
        }, function(err, items) {
          if (err) {
            return next(err);
          }
          if (items.length) {
            code = items[0].code + 1;
          }
          if (ctx.instance) {
            ctx.instance.code = code;
          } else {
            ctx.data.code = code;
          }
          return next();
        });
    } else {
      next();
    }
  });
};
