'use strict';

module.exports = function(Costsheethasmaterials) {
  Costsheethasmaterials.TotalMaterial = function(id, cb) {
    var response = [];
    var ds = Costsheethasmaterials.dataSource;
    var sql = `select Mat.costSheetId ,sum(Mat.Total) TotalMaterial from 
    ( select sheet.costSheetId ,costHis.materialId ,costHis.regionId ,(ifnull(costHis.cost, 0) * ifnull(sheet.waste, 0) * ifnull(sheet.performance, 0)) Total 
    from costsheets.CostSheetHasMaterials as sheet 
    inner join costsheets.CostSheet as ficha on ficha.id = sheet.costSheetId 
    inner join costsheets.MaterialCostHistory as costHis on costHis.materialId = sheet.materialId and costHis.regionId = ficha.regionId 
    inner join ( select his.materialId ,his.regionId ,max(his.createdAt) createdAt from costsheets.MaterialCostHistory as his group by his.materialId ,his.regionId ) his 
    on his.materialId = costHis.materialId and his.regionId = costHis.regionId and his.createdAt = costHis.createdAt where sheet.isDeleted = 0 and sheet.costSheetId = ? ) as Mat 
    group by Mat.costSheetId;`;

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

  Costsheethasmaterials.remoteMethod('TotalMaterial', {
    http: {
      path: '/:id/TotalMaterial',
      verb: 'get',
    },
    description: 'Get total cost of materials by Cost Sheet',
    accepts: [
      {
        arg: 'id',
        description: 'CostSheet Id',
        type: 'number',
        required: true,
      },
    ],
    returns: {
      arg: 'data',
      type: 'array',
    },
  });

  Costsheethasmaterials.DetailsMaterials = function(id, cb) {
    var response = [];
    var ds = Costsheethasmaterials.dataSource;
    var sql = `select sheet.Id ,sheet.costSheetId ,sheet.materialId ,hist.regionId ,mat.code ,mat.description ,unit.abbreviation ,unit.description unitsofmeasurement ,
    ifnull(hist.cost, 0) cost ,ifnull(hist.waste, 0) waste ,ifnull(hist.performance, 0) performance ,(ifnull(hist.cost, 0) * ifnull(hist.waste, 0) * ifnull(hist.performance, 0)) Total 
    from costsheets.CostSheetHasMaterials as sheet 
    inner join costsheets.Material as mat on mat.id = sheet.materialId 
    inner join costsheets.UnitsOfMeasurement as unit 
    on unit.id = mat.unitsOfMeasurementId 
    left join ( select sheet.id ,sheet.costSheetId ,costHis.materialId ,costHis.regionId ,ifnull(costHis.cost, 0) cost ,ifnull(sheet.waste, 0) waste ,
    ifnull(sheet.performance, 0) performance ,(ifnull(costHis.cost, 0) * ifnull(sheet.waste, 0) * ifnull(sheet.performance, 0)) Total 
    from costsheets.CostSheetHasMaterials as sheet 
    inner join costsheets.CostSheet as ficha on ficha.id = sheet.costSheetId 
    inner join costsheets.MaterialCostHistory as costHis on costHis.materialId = sheet.materialId and costHis.regionId = ficha.regionId 
    inner join ( select his.materialId ,his.regionId ,max(his.createdAt) createdAt 
    from costsheets.MaterialCostHistory as his 
    group by his.materialId ,his.regionId ) his on his.materialId = costHis.materialId and his.regionId = costHis.regionId and his.createdAt = costHis.createdAt 
    where sheet.isDeleted = 0 and sheet.costSheetId = ? ) as hist on hist.id = sheet.id 
    where sheet.isDeleted = 0 and sheet.costSheetId = ? order by sheet.id;`;

    if (ds) {
      if (ds.connector) {
        ds
          .connector
          .execute(sql, [
            id, id,
          ], function(err, response) {
            if (err)
              console.error(err);
            cb(null, response);
          });
      }
    }
  };

  Costsheethasmaterials.remoteMethod('DetailsMaterials', {
    http: {
      path: '/:id/DetailsMaterials',
      verb: 'get',
    },
    description: 'Get list materials materials by Cost Sheet',
    accepts: [
      {
        arg: 'id',
        description: 'CostSheet Id',
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
