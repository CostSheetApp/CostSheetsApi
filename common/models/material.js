'use strict';

module.exports = function(Material) {
    var app = require('../../server/server');
    Material.observe('before save', function updateTimestamp(ctx, next) {
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

    Material.afterRemote('create', function(ctx, material, next) {
        if(!(material.cost && material.cost>0) && !(material.regionId && material.regionId>0)) next();

        material.materialCostHistories.create({cost: material.cost, regionId: material.regionId},function(err,result){
            if(err){
                next(err);
            }
                next();
        });
    });
};
