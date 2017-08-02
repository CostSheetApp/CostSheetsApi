'use strict';

module.exports = function(Costsheethasmaterials) {
  Costsheethasmaterials.TotalMaterial = function(id, cb) {
    var response = [];
    var ds = Costsheethasmaterials.dataSource;
    var sql = 'select Mat.costSheetId 		   ,sum(Mat.Total) TotalMaterial 	  from ( 			select sh' +
        'eet.costSheetId 				   ,costHis.materialId 				   ,costHis.regionId 				   ,(ifn' +
        'ull(costHis.cost, 0) * ifnull(sheet.waste, 0) * ifnull(sheet.performance, 0)) To' +
        'tal 			  from costsheets.costsheethasmaterials as sheet  				   inner join costs' +
        'heets.costsheet as ficha  						   on ficha.id = sheet.costSheetId 				   inner ' +
        'join costsheets.materialcosthistory as costHis 						   on costHis.materialId = ' +
        'sheet.materialId 						  and costHis.regionId = ficha.regionId 				   inner join' +
        ' ( 							   select his.materialId 									  ,his.regionId 									  ,max(his.' +
        'createdAt) createdAt 								 from costsheets.materialcosthistory as his 							' +
        '	group by his.materialId 									  ,his.regionId 							  ) his 							 on his.' +
        'materialId = costHis.materialId 							and his.regionId = costHis.regionId 					' +
        '		and his.createdAt = costHis.createdAt 			where sheet.isDeleted = 0 			  and sh' +
        'eet.costSheetId = ? 		  ) as Mat 	group by Mat.costSheetId;';

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
    var sql = 'select  sheet.Id         ,sheet.costSheetId 		   ,sheet.materialId 		   ,hist.re' +
        'gionId 		   ,mat.code 		   ,mat.description 		   ,unit.abbreviation 		   ,unit.d' +
        'escription unitsofmeasurement 		   ,ifnull(hist.cost, 0) cost 		   ,ifnull(hist.' +
        'waste, 0) waste 		   ,ifnull(hist.performance, 0) performance 		   ,(ifnull(hist' +
        '.cost, 0) * ifnull(hist.waste, 0) * ifnull(hist.performance, 0)) Total 	  from c' +
        'ostsheets.costsheethasmaterials as sheet  		   inner join costsheets.material as' +
        ' mat 				   on mat.id = sheet.materialId 		   inner join costsheets.unitsofmeasu' +
        'rement as unit 				   on unit.id = mat.unitsOfMeasurementId 			left join ( 					' +
        '	select sheet.id 							   ,sheet.costSheetId 							   ,costHis.materialId 				' +
        '			   ,costHis.regionId 							   ,ifnull(costHis.cost, 0) cost 							   ,ifnul' +
        'l(sheet.waste, 0) waste 							   ,ifnull(sheet.performance, 0) performance 				' +
        '			   ,(ifnull(costHis.cost, 0) * ifnull(sheet.waste, 0) * ifnull(sheet.performa' +
        'nce, 0)) Total 						  from costsheets.costsheethasmaterials as sheet  							  ' +
        ' inner join costsheets.costsheet as ficha  									   on ficha.id = sheet.costS' +
        'heetId 							   inner join costsheets.materialcosthistory as costHis 									 ' +
        '  on costHis.materialId = sheet.materialId 									  and costHis.regionId = fic' +
        'ha.regionId 							   inner join ( 										   select his.materialId 										' +
        '		  ,his.regionId 												  ,max(his.createdAt) createdAt 											 from c' +
        'ostsheets.materialcosthistory as his 											group by his.materialId 								' +
        '				  ,his.regionId 										  ) his 										 on his.materialId = costHis.mat' +
        'erialId 										and his.regionId = costHis.regionId 										and his.createdA' +
        't = costHis.createdAt	 						where sheet.isDeleted = 0 						  and sheet.costShe' +
        'etId = ? 					  ) as hist 					 on hist.id = sheet.id 	where sheet.isDeleted = 0' +
        '  and sheet.costSheetId = ? 	order by sheet.id;';

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
