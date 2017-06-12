'use strict';

module.exports = function(Material) {
    var app = require('../../server/server');
    Material.observe('before save', function(ctx, next) {
        console.log("Before Save",ctx.instance);
        var code = 1;
        var id = 0;
        if(ctx.isNewInstance){
            if(ctx.instance){
                id = ctx.instance.entityId;
            }else{
                id = ctx.data.entityId;
            }
            Material.find({where: { entityId: id },order: 'code DESC', limit: 1,fields: {code: true}}, function(err,items){
                if(err){
                    return next(err);
                }

                if(items.length){
                    code = items[0].code + 1;
                }
                if(ctx.instance){
                    ctx.instance.code = code;
                }else{
                    ctx.data.code = code;
                }
                return next();
            }); 
        }else{
            next();
        }        
    });

    Material.observe('after save',function(ctx, next) {
        console.log(ctx.instance);

         if(ctx.isNewInstance){
            if(!(ctx.instance.cost && ctx.instance.cost>0) && !(ctx.instance.regionId && ctx.instance.regionId>0)) next();

            app.models.MaterialCostHistory.create({materialId: ctx.instance.id,cost: ctx.instance.cost, regionId: ctx.instance.regionId},function(err,result){
                console.log("if something hppen, run this")
                if(err){
                    next(err);
                }
                    next();
            });
        }else{
            next();
        }  

        
    });
};
