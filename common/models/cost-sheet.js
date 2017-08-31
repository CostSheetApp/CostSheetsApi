'use strict';

module.exports = function(Costsheet) {
  Costsheet.ConsolidateCostsheet = function(id, cb) {
    var response = [];
    var ds = Costsheet.dataSource;
    var sql = `set @IdFicha = ?;
    create temporary table HistoricoMaterial 	select Mat.costSheetId ,sum(Mat.Total) Total from 
    ( select sheet.costSheetId ,costHis.materialId ,costHis.regionId ,(ifnull(costHis.cost, 0) * ifnull(sheet.waste, 0) * ifnull(sheet.performance, 0)) Total 
    from costsheets.CostSheetHasMaterials as sheet inner join costsheets.CostSheet as ficha on ficha.id = sheet.costSheetId 
    inner join costsheets.MaterialCostHistory as costHis on costHis.materialId = sheet.materialId and costHis.regionId = ficha.regionId 
    inner join ( select his.materialId ,his.regionId ,max(his.createdAt) createdAt from costsheets.MaterialCostHistory as his group by his.materialId ,his.regionId ) his 
    on his.materialId = costHis.materialId and his.regionId = costHis.regionId and his.createdAt = costHis.createdAt
    where sheet.isDeleted = 0 and sheet.costSheetId = @IdFicha ) as Mat group by Mat.costSheetId;
    
    create temporary table HistoricoManoObra select Man.costSheetId ,sum(Man.Total) Total 
    from ( select sheet.costSheetId ,costHis.manpowerId ,costHis.regionId ,(ifnull(costHis.cost, 0) * ifnull(sheet.performance, 0)) Total 
    from costsheets.CostSheetHasManpower as sheet 
    inner join costsheets.CostSheet as ficha on ficha.id = sheet.costSheetId 
    inner join costsheets.ManpowerCostHistory as costHis 
    on costHis.manpowerId = sheet.manpowerId and costHis.regionId = ficha.regionId 
    inner join ( select his.manpowerId ,his.regionId ,max(his.createdAt) createdAt 
    from costsheets.ManpowerCostHistory as his group by his.manpowerId ,his.regionId ) his on his.manpowerId = costHis.manpowerId and his.regionId = costHis.regionId 
    and his.createdAt = costHis.createdAt where sheet.isDeleted = 0 and sheet.costSheetId = @IdFicha ) as Man 	group by Man.costSheetId;
    
    create temporary table HistoricoHerramientas select tool.costSheetId ,sum(tool.Total) Total from 
    ( select sheet.costSheetId ,costHis.toolsAndEquipmentId ,costHis.regionId ,(ifnull(costHis.cost, 0) * ifnull(sheet.performance, 0)) Total 
    from costsheets.CostSheetHasToolsAndEquipment as sheet 
    inner join costsheets.CostSheet as ficha on ficha.id = sheet.costSheetId 
    inner join costsheets.ToolsAndEquipmentCostHistory as costHis on costHis.toolsAndEquipmentId = sheet.toolsAndEquipmentId and costHis.regionId = ficha.regionId
    inner join ( select his.toolsAndEquipmentId ,his.regionId ,max(his.createdAt) createdAt from costsheets.ToolsAndEquipmentCostHistory as his group by his.toolsAndEquipmentId ,his.regionId ) his 
    on his.toolsAndEquipmentId = costHis.toolsAndEquipmentId and his.regionId = costHis.regionId and his.createdAt = costHis.createdAt 
    where sheet.isDeleted = 0 and sheet.costSheetId = @IdFicha ) as tool 	 group by tool.costSheetId; 
    SELECT 
        sheet.id,
        sheet.description,
        sheet.regionId,
        sheet.unitsOfMeasurementId,
        hisMat.Total AS TotalMaterial,
        hisMan.Total AS TotalManPower,
        hisTool.Total AS TotalTools,
        IFNULL(hisMat.Total, 0) + IFNULL(hisMan.Total, 0) + IFNULL(hisTool.Total, 0) minimumCost
    FROM
        costsheets.CostSheet AS sheet
            LEFT JOIN
        HistoricoMaterial AS hisMat ON hisMat.costSheetId = sheet.id
            LEFT JOIN
        HistoricoManoObra AS hisMan ON hisMan.costSheetId = sheet.id
            LEFT JOIN
        HistoricoHerramientas AS hisTool ON hisTool.costSheetId = sheet.id
    WHERE
        sheet.isDeleted = 0
            AND sheet.id = @IdFicha; 
    drop temporary table if exists HistoricoMaterial; 	
    drop temporary table if exists HistoricoManoObra; 	
    drop temporary table if exists HistoricoHerramientas;`;

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
  Costsheet.remoteMethod('ConsolidateCostsheet', {
    http: {
      path: '/:id/ConsolidateCostsheet',
      verb: 'get',
    },
    description: 'Get total cost by Costs heet',
    accepts: [
      {
        arg: 'id',
        description: 'Costsheet Id',
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
