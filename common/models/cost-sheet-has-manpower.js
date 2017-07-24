'use strict';

module.exports = function(Costsheethasmanpower) {

	Costsheethasmanpower.TotalManPower = function(id, cb) {
    //console.log(`id ${id}`)
    var response = [];
    var ds = Costsheethasmanpower.dataSource;
    var sql = 'select Man.costSheetId ' +
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

    Costsheethasmanpower.remoteMethod
	(
    'TotalManPower',
      {
        http: {path: '/:id/TotalManPower', verb: 'get'},
        description: 'Get total cost of man power by Cost Sheet',
        accepts: [{arg: 'id', description: 'CostSheet Id', type: 'number',required: true}],
        returns: {arg: 'data', type: 'array'},
      }
    );
	
	Costsheethasmanpower.DetailsManPowers = function(id, cb) {
    //console.log(`id ${id}`)
    var response = [];
    var ds = Costsheethasmanpower.dataSource;
    var sql = 'select sheet.costSheetId ' +
			  '		   ,sheet.manpowerId ' +
			  '		   ,hist.regionId ' +
			  '		   ,mat.code ' +
			  '		   ,mat.description ' +
			  '        ,job.description job ' +
			  '		   ,ifnull(hist.cost, 0) cost ' +
			  '		   ,ifnull(hist.performance, 0) performance ' +
			  '		   ,ifnull(hist.Total, 0) Total ' +
			  '	  from costsheets.costsheethasmanpower as sheet  ' +
			  '		   inner join costsheets.manpower as mat ' +
			  '				   on mat.id = sheet.manpowerId ' +
			  '		   inner join costsheets.job as job ' +
			  '				   on job.id = mat.jobId ' +
			  '			left join ( ' +
			  '						select sheet.id ' +
			  '							   ,costHis.manpowerId ' +
			  '							   ,costHis.regionId ' +
			  '							   ,ifnull(costHis.cost, 0) cost ' +
			  '							   ,ifnull(sheet.performance, 0) performance ' +
			  '							   ,(ifnull(costHis.cost, 0) * ifnull(sheet.performance, 0)) Total ' +
			  '						  from costsheets.costsheethasmanpower as sheet  ' +
			  '							   inner join costsheets.costsheet as ficha  ' +
			  '									   on ficha.id = sheet.costSheetId ' +
			  '							   inner join costsheets.manpowercosthistory as costHis ' +
			  '									   on costHis.manpowerId = sheet.manpowerId ' +
			  '									  and costHis.regionId = ficha.regionId ' +
			  '							   inner join ( ' +
			  '										   select his.manpowerId ' +
			  '												  ,his.regionId ' +
			  '												  ,max(his.createdAt) createdAt ' +
			  '											 from costsheets.manpowercosthistory as his ' +
			  '											group by his.manpowerId ' +
			  '												  ,his.regionId ' +
			  '										  ) his ' +
			  '										 on his.manpowerId = costHis.manpowerId ' +
			  '										and his.regionId = costHis.regionId ' +
			  '										and his.createdAt = costHis.createdAt ' +
			  '						where sheet.isDeleted = 0 ' +
			  '						  and sheet.costSheetId = ? ' +
			  '	) as hist ' +
			  '	on hist.id = sheet.id ' +
			  ' where sheet.isDeleted = 0 ' +
			  ' and sheet.costSheetId = ? ' +
			  ' order by sheet.id;';

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

    Costsheethasmanpower.remoteMethod
  (
    'DetailsManPowers',
      {
        http: {path: '/:id/DetailsManPowers', verb: 'get'},
        description: 'Get list man powers by Cost Sheet',
        accepts: [{arg: 'id', description: 'CostSheet Id', type: 'number',required: true}],
        returns: {arg: 'data', type: 'array'},
      }
    );

};
