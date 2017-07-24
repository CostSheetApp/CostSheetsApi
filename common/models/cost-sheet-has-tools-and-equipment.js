'use strict';

module.exports = function(Costsheethastoolsandequipment) {

	Costsheethastoolsandequipment.TotalToolEquipment = function(id, cb) {
    //console.log(`id ${id}`)
    var response = [];
    var ds = Costsheethastoolsandequipment.dataSource;
    var sql = 'select Man.costSheetId ' +
			  '		   ,sum(Man.Total) Total ' +
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
			  '			  and sheet.costSheetId = ? ' +
			  '		  ) as Man ' +
			  '	group by Man.costSheetId;';

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

    Costsheethastoolsandequipment.remoteMethod
	(
    'TotalToolEquipment',
      {
        http: {path: '/:id/TotalToolEquipment', verb: 'get'},
        description: 'Get total cost of tool and equipment by Cost Sheet',
        accepts: [{arg: 'id', description: 'CostSheet Id', type: 'number',required: true}],
        returns: {arg: 'data', type: 'array'},
      }
    );
	
	Costsheethastoolsandequipment.DetailsToolsAndEquipment = function(id, cb) {
    //console.log(`id ${id}`)
    var response = [];
    var ds = Costsheethastoolsandequipment.dataSource;
    var sql = 'select sheet.costSheetId ' +
			  '		   ,sheet.toolsAndEquipmentId ' +
			  '		   ,hist.regionId ' +
			  '		   ,mat.code ' +
			  '		   ,mat.description ' +
			  '		   ,ifnull(hist.cost, 0) cost ' +
			  '		   ,ifnull(hist.performance, 0) performance ' +
			  '		   ,ifnull(hist.Total, 0) Total ' +
			  '	  from costsheets.costsheethastoolsandequipment as sheet  ' +
			  '		   inner join costsheets.toolsandequipment as mat ' +
			  '				   on mat.id = sheet.toolsAndEquipmentId ' +
			  '			left join ( ' +
			  '						select sheet.id ' +
			  '							   ,costHis.toolsAndEquipmentId ' +
			  '							   ,costHis.regionId ' +
			  '							   ,ifnull(costHis.cost, 0) cost ' +
			  '							   ,ifnull(sheet.performance, 0) performance ' +
			  '							   ,(ifnull(costHis.cost, 0) * ifnull(sheet.performance, 0)) Total ' +
			  '						  from costsheets.costsheethastoolsandequipment as sheet  ' +
			  '							   inner join costsheets.costsheet as ficha  ' +
			  '									   on ficha.id = sheet.costSheetId ' +
			  '							   inner join costsheets.toolsandequipmentcosthistory as costHis ' +
			  '									   on costHis.toolsAndEquipmentId = sheet.toolsAndEquipmentId ' +
			  '									  and costHis.regionId = ficha.regionId ' +
			  '							   inner join ( ' +
			  '										   select his.toolsAndEquipmentId ' +
			  '												  ,his.regionId ' +
			  '												  ,max(his.createdAt) createdAt ' +
			  '											 from costsheets.toolsandequipmentcosthistory as his ' +
			  '											group by his.toolsAndEquipmentId ' +
			  '												  ,his.regionId ' +
			  ' 										  ) his ' +
			  '										 on his.toolsAndEquipmentId = costHis.toolsAndEquipmentId ' +
			  '										and his.regionId = costHis.regionId ' +
			  '										and his.createdAt = costHis.createdAt ' +
			  '						where sheet.isDeleted = 0 ' +
			  '						  and sheet.costSheetId = ? ' +
			  '	) as hist ' +
			  '	on hist.id = sheet.id ' +
			  '	where sheet.isDeleted = 0 ' +
			  ' and sheet.costSheetId = ? ' +
			  '	order by sheet.id;';

    if (ds) {
      if (ds.connector) {
        ds.connector.execute(sql, [id,id], function(err, response) {
          if (err)
            console.error(err);
          cb(null, response);
        });
      }
    }
  };

    Costsheethastoolsandequipment.remoteMethod
	(
    'DetailsToolsAndEquipment',
      {
        http: {path: '/:id/DetailsToolsAndEquipment', verb: 'get'},
        description: 'Get list tools and equipment by Cost Sheet',
        accepts: [{arg: 'id', description: 'CostSheet Id', type: 'number',required: true}],
        returns: {arg: 'data', type: 'array'},
      }
    );
	

};
