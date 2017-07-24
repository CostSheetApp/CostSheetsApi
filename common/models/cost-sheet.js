'use strict';

module.exports = function(Costsheet) {

Costsheet.ConsolidateCostsheet = function(id, cb) {
    //console.log(`id ${id}`)
    var response = [];
    var ds = Costsheet.dataSource;
			
	var sql = ' set @IdFicha = 3; ' +
			  '					 ' +
			  '	create temporary table HistoricoMaterial ' +
			  '	select Mat.costSheetId ' +
			  '		   ,sum(Mat.Total) Total ' +
			  '	  from ( ' +
			  '			select sheet.costSheetId ' +
			  '				   ,costHis.materialId ' +
			  '				   ,costHis.regionId ' +
			  '				   ,(ifnull(costHis.cost, 0) * ifnull(sheet.waste, 0) * ifnull(sheet.performance, 0)) Total ' +
			  '			  from costsheets.costsheethasmaterials as sheet  ' +
			  '				   inner join costsheets.costsheet as ficha  ' +
			  '						   on ficha.id = sheet.costSheetId ' +
			  '				   inner join costsheets.materialcosthistory as costHis ' +
			  '						   on costHis.materialId = sheet.materialId ' +
			  '						  and costHis.regionId = ficha.regionId ' +
			  '				   inner join ( ' +
			  '							   select his.materialId ' +
			  '									  ,his.regionId ' +
			  '									  ,max(his.createdAt) createdAt ' +
			  '								 from costsheets.materialcosthistory as his ' +
			  '								group by his.materialId ' +
			  '									  ,his.regionId ' +
			  '							  ) his ' +
			  '							 on his.materialId = costHis.materialId ' +
			  '							and his.regionId = costHis.regionId ' +
			  '							and his.createdAt = costHis.createdAt ' +
			  '			where sheet.isDeleted = 0 ' +
			  '			  and sheet.costSheetId = @IdFicha ' +
			  '		  ) as Mat ' +
			  '	group by Mat.costSheetId; ' +
			  '							  ' +
			  '	create temporary table HistoricoManoObra ' +
			  '	select Man.costSheetId ' +
			  '		   ,sum(Man.Total) Total ' +
			  '	  from ( ' +
			  '			select sheet.costSheetId ' +
			  '				   ,costHis.manpowerId ' +
			  '				   ,costHis.regionId ' +
			  '				   ,(ifnull(costHis.cost, 0) * ifnull(sheet.performance, 0)) Total ' +
			  '			  from costsheets.costsheethasmanpower as sheet  ' +
			  '				   inner join costsheets.costsheet as ficha  ' +
			  '						   on ficha.id = sheet.costSheetId ' +
			  '				   inner join costsheets.manpowercosthistory as costHis ' +
			  '						   on costHis.manpowerId = sheet.manpowerId ' +
			  '						  and costHis.regionId = ficha.regionId ' +
			  '				   inner join ( ' +
			  '							   select his.manpowerId ' +
			  '									  ,his.regionId ' +
			  '									  ,max(his.createdAt) createdAt ' +
			  '								 from costsheets.manpowercosthistory as his ' +
			  '								group by his.manpowerId ' +
			  '									  ,his.regionId ' +
			  '							  ) his ' +
			  '							 on his.manpowerId = costHis.manpowerId ' +
			  '							and his.regionId = costHis.regionId ' +
			  '							and his.createdAt = costHis.createdAt ' +
			  '			where sheet.isDeleted = 0 ' +
			  '			  and sheet.costSheetId = @IdFicha ' +
			  '		  ) as Man ' +
			  '	group by Man.costSheetId; ' +
			  '							   ' +
			  '	create temporary table HistoricoHerramientas ' +
			  '	select tool.costSheetId ' +
			  '		   ,sum(tool.Total) Total ' +
			  '	  from ( ' +
			  '			select sheet.costSheetId ' +
			  '				   ,costHis.toolsAndEquipmentId ' +
			  '				   ,costHis.regionId ' +
			  '				   ,(ifnull(costHis.cost, 0) * ifnull(sheet.performance, 0)) Total ' +
			  '			  from costsheets.costsheethastoolsandequipment as sheet  ' +
			  '				   inner join costsheets.costsheet as ficha  ' +
			  '						   on ficha.id = sheet.costSheetId ' +
			  '				   inner join costsheets.toolsandequipmentcosthistory as costHis ' +
			  '						   on costHis.toolsAndEquipmentId = sheet.toolsAndEquipmentId ' +
			  '						  and costHis.regionId = ficha.regionId ' +
			  '				   inner join ( ' +
			  '							   select his.toolsAndEquipmentId ' +
			  '									  ,his.regionId ' +
			  '									  ,max(his.createdAt) createdAt ' +
			  '								 from costsheets.toolsandequipmentcosthistory as his ' +
			  '								group by his.toolsAndEquipmentId ' +
			  '									  ,his.regionId ' +
			  '							  ) his ' +
			  '							 on his.toolsAndEquipmentId = costHis.toolsAndEquipmentId ' +
			  '							and his.regionId = costHis.regionId ' +
			  '							and his.createdAt = costHis.createdAt ' +
			  '			where sheet.isDeleted = 0 ' +
			  '			  and sheet.costSheetId = @IdFicha ' +
			  '		   ) as tool ' +
			  '	 group by tool.costSheetId; ' +
			  '								 ' +
			  '	select sheet.id ' +
			  '		   ,sheet.description ' +
			  '		   ,sheet.regionId ' +
			  '		   ,sheet.unitsOfMeasurementId ' +
			  '		   ,hisMat.Total as TotalMaterial ' +
			  '		   ,hisMan.Total as TotalManPower ' +
			  '		   ,hisTool.Total as TotalTools ' +
			  '		   ,ifnull(hisMat.Total, 0) + ifnull(hisMan.Total, 0) + ifnull(hisTool.Total, 0) minimumCost ' +
			  '	  from costsheets.costsheet as sheet ' +
			  '			left join HistoricoMaterial as hisMat ' +
			  '				   on hisMat.costSheetId = sheet.id ' +
			  '			left join HistoricoManoObra as hisMan ' +
			  '				   on hisMan.costSheetId = sheet.id ' +
			  '			left join HistoricoHerramientas as hisTool ' +
			  '				   on hisTool.costSheetId = sheet.id ' +
			  '	 where sheet.isDeleted = 0 ' +
			  '	   and sheet.id = @IdFicha; ' +
			  '								 ' +
			  '	drop temporary table if exists HistoricoMaterial; ' +
			  '	drop temporary table if exists HistoricoManoObra; ' +
			  '	drop temporary table if exists HistoricoHerramientas; ';
	
	console.log(sql);

    if (ds) {
      if (ds.connector) {
        ds.connector.execute(sql, [id], function(err, response) {
          if (err)
            console.error(err);
          cb(null, response);
        });
      }
    }
  };

    Costsheet.remoteMethod
  (
    'ConsolidateCostsheet',
      {
        http: {path: '/:id/ConsolidateCostsheet', verb: 'get'},
        description: 'Get total cost by Costs heet',
        accepts: [{arg: 'id', description: 'Costsheet Id', type: 'number',required: true}],
        returns: {arg: 'data', type: 'array'},
      }
    );


};
