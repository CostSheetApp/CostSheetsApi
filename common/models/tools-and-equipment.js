'use strict';

module.exports = function(Toolsandequipment) {
  Toolsandequipment.observe('before save', function updateTimestamp(ctx, next) {
    var code = 1;
    var id = 0;
    if (ctx.isNewInstance) {
      if (ctx.instance) {
        id = ctx.instance.entityId;
      } else {
        id = ctx.data.entityId;
      }
      Toolsandequipment
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

  Toolsandequipment.observe('after save', function(ctx, next) {
    console.log(ctx.instance);

    if (ctx.isNewInstance) {
      if (!(ctx.instance.cost && ctx.instance.cost > 0) && !(ctx.instance.regionId && ctx.instance.regionId > 0))
        next();

      Toolsandequipment.app
        .models
        .ToolsAndEquipmentCostHistory
        .create({
          toolsAndEquipmentId: ctx.instance.id,
          cost: ctx.instance.cost,
          regionId: ctx.instance.regionId,
        }, function(err, result) {
          console.log('if something hppen, run this');
          if (err) {
            next(err);
          }
          next();
        });
    } else {
      next();
    }
  });

  Toolsandequipment.CostHistory = function(id, cb) {
    var response = [];
    var ds = Toolsandequipment.dataSource;
    var sql = `select ms.id ,m.code ,m.description as ToolandEquipment ,r.name as region ,ms.cost ,ms.createdAt from costsheets.ToolsAndEquipment as m 
    inner join costsheets.ToolsAndEquipmentCostHistory as ms on ms.toolsAndEquipmentId = m.id 
    inner join costsheets.Region as r on r.id = ms.regionId and r.isDeleted = 0 
    where m.isDeleted = 0 and m.id = ? order by ms.createdAt ,r.name ,m.description`;

    if (ds) {
      if (ds.connector) {
        ds
          .connector
          .execute(sql, [id], function(err, response) {
            if (err)
              console.error(err);

            var regions = [];
            response.forEach(function(o) {
              if (regions[o.region] == undefined) {
                regions[o.region] = [];
              }
              regions[o.region].push([
                o
                  .createdAt
                  .getTime(),
                o.cost,
              ]);
            });

            var data = [];
            for (var key in regions) {
              data.push({
                name: key,
                data: regions[key],
                tooltip: {
                  valueDecimals: 2,
                },
                marker: {
                  enabled: true,
                  radius: 3,
                },
                shadow: true,
              });
            }

            cb(null, data);
          });
      }
    }
  };

  Toolsandequipment.remoteMethod('CostHistory', {
    http: {
      path: '/:id/CostHistory',
      verb: 'get',
    },
    description: 'Get list of cost history by Tools and equipment',
    accepts: [
      {
        arg: 'id',
        description: 'Tools and Equipment Id',
        type: 'number',
        required: true,
      },
    ],
    returns: {
      arg: 'data',
      type: 'array',
    },
  });

  Toolsandequipment.CostHistoryData = function(id, cb) {
    var response = [];
    var ds = Toolsandequipment.dataSource;
    var sql = `select ms.id ,m.code ,m.description as ToolandEquipment ,r.name as region ,ms.cost ,ms.createdAt 
    from costsheets.ToolsAndEquipment as m inner join costsheets.ToolsAndEquipmentCostHistory as ms on ms.toolsAndEquipmentId = m.id 
    inner join costsheets.Region as r on r.id = ms.regionId and r.isDeleted = 0 
    where m.isDeleted = 0 and m.id = ? order by ms.createdAt ,r.name ,m.description`;

    if (ds) {
      if (ds.connector) {
        ds
          .connector
          .execute(sql, [id], function(err, response) {
            if (err)
              console.error(err);
            cb(null, response);
          });
      }
    }
  };

  Toolsandequipment.remoteMethod('CostHistoryData', {
    http: {
      path: '/:id/CostHistoryData',
      verb: 'get',
    },
    description: 'Get list of cost history by Tools and equipment',
    accepts: [
      {
        arg: 'id',
        description: 'Tools and Equipment Id',
        type: 'number',
        required: true,
      },
    ],
    returns: {
      arg: 'data',
      type: 'array',
    },
  });
};
