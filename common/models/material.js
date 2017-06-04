'use strict';

module.exports = function(Material) {
    // var app = require('../../server/server');
    // Material.observe('before save', function updateTimestamp(ctx, next) {
    //     if(ctx.isNewInstance){
    //         ctx.instance.code = 1;

    //         const User = app.models.Account;    // works!
    //         const token = ctx.options && ctx.options.accessToken;
    //         const userId = token && token.userId;

    //         User.findById(userId,function(err,user){
    //             if(err){
    //                 return next(err);
    //             }
    //             Material.find({where: {entityId: 1},order: 'code DESC', limit: 1,fields: {code: true}}, function(err,materials){
    //                 if(materials.length){
    //                     if(ctx.instance){
    //                         ctx.instance.entityId = user.entityId;
    //                         ctx.instance.code = materials[0].code + 1;
    //                     }else{
    //                         ctx.data.entityId = user.entityId;
    //                         ctx.data.code = materials[0].code + 1;
    //                     }
    //                 }
    //                 return next();
    //             });    
    //         });
    //     }
    //     next();
    // });
};
