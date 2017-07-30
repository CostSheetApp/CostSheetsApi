'use strict';

module.exports = function(Project) {
  Project.ConsolidateMaterial = function(id, cb) {
    //console.log(`id ${id}`)
    var response = [];
    var ds = Project.dataSource;
    var sql = 'select name ' +
                  '       ,code ' +
                  '       ,description ' +
                  '       ,unitsOfMeasurement ' +
                  '       ,sum(ifnull(waste,0) * ifnull(performance,0) * ifnull(totalUnit,0)) totalUnit ' +
                  '       ,sum(ifnull(waste,0) * ifnull(performance,0) * ifnull(Cost,0) * ifnull(totalUnit,0)) Total ' +
                  '  from ( ' +
                  '        select p.name ' +
                  '      ,mate.code ' +
                  '      ,mate.description ' +
                  '      ,unit.description as unitsOfMeasurement ' +
                  '      ,mate.waste ' +
                  '      ,sm.performance ' +
                  '      ,ps.totalUnit ' +
                  '      ,(select cost.cost ' +
                  '          from costsheets.materialcosthistory as cost ' +
                  '          where cost.materialId = mate.id ' +
				  '			     and cost.regionId = ps.regionId ' +
                  '              and cost.createdAt <= p.startDate ' +
                  '          order by cost.createdAt desc ' +
                  '          limit 1 ' +
                  '          ) Cost      ' +
                  '  from costsheets.project as p ' +
                  '      inner join costsheets.projecthascostsheets as ps  ' +
                  '              on ps.projectId = p.id ' +
                  '      inner join costsheets.costsheet as sheet ' +
                  '              on sheet.id = ps.costSheetId ' +
                  '              and sheet.isDeleted = 0 ' +
                  '      inner join costsheets.costsheethasmaterials as sm ' +
                  '              on sm.costSheetId = sheet.id ' +
                  '      inner join costsheets.material as mate ' +
                  '              on mate.id = sm.materialId ' +
                  '      inner join costsheets.unitsofmeasurement as unit ' +
                  '              on unit.id = mate.unitsOfMeasurementId ' +
                  '  where p.isDeleted = 0 ' +
                  '  and p.id = ? ' +
                  '  ) as temp ' +
                  '  group by name ' +
                  '      ,code ' +
                  '      ,description ' +
                  '      ,unitsOfMeasurement';

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

    Project.remoteMethod
  (
    'ConsolidateMaterial',
      {
        http: {path: '/:id/ConsolidateMaterial', verb: 'get'},
        description: 'Get list of materials by project',
        accepts: [{arg: 'id', description: 'Project Id', type: 'number',required: true}],
        returns: {arg: 'data', type: 'array'},
      }
    );

  Project.ConsolidateManPower = function(id, cb) {
    var response = [];
    var ds = Project.dataSource;
    var sql = 'select name ' +
              '       ,code ' +
              '       ,description ' +
              '       ,sum(ifnull(performance,1) * ifnull(totalUnit,0)) totalUnit ' +
              '       ,sum(ifnull(performance,1) * ifnull(Cost, 0) * ifnull(totalUnit,0)) Total ' +
              '  from ( ' +
              '  select p.name ' +
              '        ,man.code ' +
              '        ,man.description ' +
              '        ,sm.performance ' +
              '        ,ps.totalUnit ' +
              '        ,(select cost.cost ' +
              '            from costsheets.manpowercosthistory as cost ' +
              '            where cost.manpowerId = man.id ' +
              '              and cost.regionId = ps.regionId ' +
              '              and cost.createdAt <= p.startDate ' +
              '            order by cost.createdAt desc ' +
              '            limit 1 ' +
              '          ) Cost ' +
              '    from costsheets.project as p ' +
              '        inner join costsheets.projecthascostsheets as ps ' +
              '                on ps.projectId = p.id ' +
              '        inner join costsheets.costsheet as sheet ' +
              '                on sheet.id = ps.costSheetId ' +
              '                and sheet.isDeleted = 0 ' +
              '        inner join costsheets.costsheethasmanpower as sm ' +
              '                on sm.costSheetId = sheet.id ' +
              '        inner join costsheets.manpower as man ' +
              '                on man.id = sm.manpowerId ' +
              '  where p.isDeleted = 0 ' +
              '    and p.id = ? ' +
              '    ) as temp ' +
              '  group by name ' +
              '        ,code ' +
              '        ,description';

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

  
  Project.remoteMethod
  (
    'ConsolidateManPower',
      {
        http: {path: '/:id/ConsolidateManPower', verb: 'get'},
        description: 'Get list of man power by project',
        accepts: [{arg: 'id', description: 'Man Power Id', type: 'number',required: true}],
        returns: {arg: 'data', type: 'array'},
      }
    );
	
  Project.ConsolidateToolsAndEquipment = function(id, cb) {
    var response = [];
    var ds = Project.dataSource;
    var sql = 'select name ' +
              '        ,code ' +
              '        ,description ' +
              '        ,sum(ifnull(performance,1) * ifnull(totalUnit,0)) totalUnit ' +
              '        ,sum(ifnull(performance,1) * ifnull(Cost, 0) * ifnull(totalUnit,0)) Total ' +
              '  from ( ' +
              '  select p.name ' +
              '        ,tool.code ' +
              '        ,tool.description ' +
              '        ,st.performance ' +
              '        ,ps.totalUnit ' +
              '        ,(select cost.cost ' +
              '            from costsheets.toolsandequipmentcosthistory as cost ' +
              '            where cost.toolsAndEquipmentId = tool.id ' +
              '              and cost.regionId = ps.regionId ' +
              '              and cost.createdAt <= p.startDate ' +
              '            order by cost.createdAt desc ' +
              '            limit 1 ' +
              '         ) Cost ' +
              '    from costsheets.project as p ' +
              '        inner join costsheets.projecthascostsheets as ps ' +
              '                on ps.projectId = p.id ' +
              '        inner join costsheets.costsheet as sheet ' +
              '                on sheet.id = ps.costSheetId ' +
              '                and sheet.isDeleted = 0 ' +
              '        inner join costsheets.costsheethastoolsandequipment as st ' +
              '                on st.costSheetId = sheet.id ' +
              '        inner join costsheets.toolsandequipment as tool ' +
              '                on tool.id = st.toolsAndEquipmentId ' +
              '  where p.isDeleted = 0 ' +
              '    and p.id = ? ' +
              '    ) as temp ' +
              '  group by name ' +
              '        ,code ' +
              '        ,description';

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

  Project.remoteMethod
  (
    'ConsolidateToolsAndEquipment',
      {
        http: {path: '/:id/ConsolidateToolsAndEquipment', verb: 'get'},
        description: 'Get list of tools and equipment by project',
        accepts: [{arg: 'id', description: 'Tools And Equipment Id', type: 'number',required: true}],
        returns: {arg: 'data', type: 'array'},
      }
  );


   Project.ExportAsExcel = function(id,res, cb) {
    let Excel = require('exceljs');
 
    var workbook = new Excel.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Her';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);

    var worksheet = workbook.addWorksheet('My Sheet', {properties:{tabColor:{argb:'FFC0000'}}});
    var worksheet2 = workbook.addWorksheet('My Sheet2', {properties:{tabColor:{argb:'FFC0000'}}});

    worksheet.columns = [
        { header: 'Id', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 32 },
        { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
    ];

    // Add a couple of Rows by key-value, after the last current row, using the column keys 
    // worksheet.addRow({id: 1, name: 'John Doe', DOB: new Date(1970,1,1)});
    // worksheet.addRow({id: 2, name: 'Jane Doe', DOB: new Date(1965,1,7)});
    for(var i=0;i<3000;i++){
      worksheet.addRow({id: i, name: 'Jane Doe' + i, DOB: new Date(1965,1,7)});
    }

//    worksheet.getCell('A5').value = { formula: 'A2+A3+A4', result: 6 };

    res.attachment("test.xlsx")
    workbook.xlsx.write(res) .then(function() {
      res.end()
    });
 
  };

  Project.remoteMethod
  (
    'ExportAsExcel',
      {
       accepts: [
        {arg: 'id', type: 'string', required: true },
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ],
      returns: {},
      http: {path: '/ExportAsExcel/:id', verb: 'get'}
      }
  );
};
