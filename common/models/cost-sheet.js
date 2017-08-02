'use strict';

module.exports = function(Costsheet) {
  Costsheet.ConsolidateCostsheet = function(id, cb) {
    var response = [];
    var ds = Costsheet.dataSource;
    var sql = ' set @IdFicha = 3; 	create temporary table HistoricoMaterial 	select Mat.costShe' +
        'etId 			 ,sum(Mat.Total) Total 		from ( 			select sheet.costSheetId 					 ,costH' +
        'is.materialId 					 ,costHis.regionId 					 ,(ifnull(costHis.cost, 0) * ifnull(s' +
        'heet.waste, 0) * ifnull(sheet.performance, 0)) Total 				from costsheets.costshe' +
        'ethasmaterials as sheet						 inner join costsheets.costsheet as ficha								 o' +
        'n ficha.id = sheet.costSheetId 					 inner join costsheets.materialcosthistory a' +
        's costHis 							 on costHis.materialId = sheet.materialId 							and costHis.re' +
        'gionId = ficha.regionId 					 inner join ( 								 select his.materialId 						' +
        '				,his.regionId 										,max(his.createdAt) createdAt 								 from costshee' +
        'ts.materialcosthistory as his 								group by his.materialId 										,his.reg' +
        'ionId 								) his 							 on his.materialId = costHis.materialId 							and hi' +
        's.regionId = costHis.regionId 							and his.createdAt = costHis.createdAt 			wh' +
        'ere sheet.isDeleted = 0 				and sheet.costSheetId = @IdFicha 			) as Mat 	group ' +
        'by Mat.costSheetId; 									create temporary table HistoricoManoObra 	select Ma' +
        'n.costSheetId 			 ,sum(Man.Total) Total 		from ( 			select sheet.costSheetId 			' +
        '		 ,costHis.manpowerId 					 ,costHis.regionId 					 ,(ifnull(costHis.cost, 0) *' +
        ' ifnull(sheet.performance, 0)) Total 				from costsheets.costsheethasmanpower as' +
        ' sheet						 inner join costsheets.costsheet as ficha								 on ficha.id = shee' +
        't.costSheetId 					 inner join costsheets.manpowercosthistory as costHis 							' +
        ' on costHis.manpowerId = sheet.manpowerId 							and costHis.regionId = ficha.re' +
        'gionId 					 inner join ( 								 select his.manpowerId 										,his.regionId' +
        ' 										,max(his.createdAt) createdAt 								 from costsheets.manpowercosthi' +
        'story as his 								group by his.manpowerId 										,his.regionId 								) h' +
        'is 							 on his.manpowerId = costHis.manpowerId 							and his.regionId = cost' +
        'His.regionId 							and his.createdAt = costHis.createdAt 			where sheet.isDelet' +
        'ed = 0 				and sheet.costSheetId = @IdFicha 			) as Man 	group by Man.costSheetI' +
        'd; 								 	create temporary table HistoricoHerramientas 	select tool.costSheet' +
        'Id 			 ,sum(tool.Total) Total 		from ( 			select sheet.costSheetId 					 ,costHi' +
        's.toolsAndEquipmentId 					 ,costHis.regionId 					 ,(ifnull(costHis.cost, 0) * ' +
        'ifnull(sheet.performance, 0)) Total 				from costsheets.costsheethastoolsandequi' +
        'pment as sheet						 inner join costsheets.costsheet as ficha								 on ficha.i' +
        'd = sheet.costSheetId 					 inner join costsheets.toolsandequipmentcosthistory a' +
        's costHis 							 on costHis.toolsAndEquipmentId = sheet.toolsAndEquipmentId 			' +
        '				and costHis.regionId = ficha.regionId 					 inner join ( 								 select his' +
        '.toolsAndEquipmentId 										,his.regionId 										,max(his.createdAt) creat' +
        'edAt 								 from costsheets.toolsandequipmentcosthistory as his 								group ' +
        'by his.toolsAndEquipmentId 										,his.regionId 								) his 							 on his.' +
        'toolsAndEquipmentId = costHis.toolsAndEquipmentId 							and his.regionId = cost' +
        'His.regionId 							and his.createdAt = costHis.createdAt 			where sheet.isDelet' +
        'ed = 0 				and sheet.costSheetId = @IdFicha 			 ) as tool 	 group by tool.costSh' +
        'eetId; 								 	select sheet.id 			 ,sheet.description 			 ,sheet.regionId 			 ' +
        ',sheet.unitsOfMeasurementId 			 ,hisMat.Total as TotalMaterial 			 ,hisMan.Total' +
        ' as TotalManPower 			 ,hisTool.Total as TotalTools 			 ,ifnull(hisMat.Total, 0) ' +
        '+ ifnull(hisMan.Total, 0) + ifnull(hisTool.Total, 0) minimumCost 		from costshee' +
        'ts.costsheet as sheet 			left join HistoricoMaterial as hisMat 					 on hisMat.c' +
        'ostSheetId = sheet.id 			left join HistoricoManoObra as hisMan 					 on hisMan.c' +
        'ostSheetId = sheet.id 			left join HistoricoHerramientas as hisTool 					 on his' +
        'Tool.costSheetId = sheet.id 	 where sheet.isDeleted = 0 		 and sheet.id = @IdFic' +
        'ha; 								 	drop temporary table if exists HistoricoMaterial; 	drop temporary ' +
        'table if exists HistoricoManoObra; 	drop temporary table if exists HistoricoHerr' +
        'amientas; ';

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
