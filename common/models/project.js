'use strict';

module.exports = function(Project) {
  Project.ConsolidateMaterial = function(id, cb) {
    console.log(`id ${id}`)
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
                  '              and cost.createdAt <= sheet.createdAt ' +
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

  Project.ConsolidateManPower = function(manPowerId, cb) {
    var response = [];
    var ds = Project.dataSource;
    var sql = 'select name ' +
              '       ,code ' +
              '       ,description ' +
              '       ,sum(ifnull(performance,0) * ifnull(totalUnit,0)) totalUnit ' +
              '       ,sum(ifnull(performance,0) * ifnull(Cost, 0) * ifnull(totalUnit,0)) Total ' +
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
              '              and cost.createdAt <= sheet.createdAt ' +
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
              '    and p.id = 1 ' +
              '    ) as temp ' +
              '  group by name ' +
              '        ,code ' +
              '        ,description';

    if (ds) {
      if (ds.connector) {
        ds.connector.execute(sql, manPowerId, function(err, response) {
          if (err)
            console.error(err);
          cb(null, response);
        });
      }
    }
  };

  Project.ConsolidateToolsAndEquipment = function(toolsAndEquipmentId, cb) {
    var response = [];
    var ds = Project.dataSource;
    var sql = 'select name ' +
              '        ,code ' +
              '        ,description ' +
              '        ,sum(performance * totalUnit) totalUnit ' +
              '        ,sum(performance * Cost * totalUnit) Total ' +
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
              '              and cost.createdAt <= sheet.createdAt ' +
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
              '    and p.id = 1 ' +
              '    ) as temp ' +
              '  group by name ' +
              '        ,code ' +
              '        ,description';

    if (ds) {
      if (ds.connector) {
        ds.connector.execute(sql, toolsAndEquipmentId, function(err, response) {
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
        http: {verb: 'get'},
        description: 'Get list of man power by project',
        accepts: {arg: 'manPowerId', description: 'Man Power Id', type: 'number', http: {source: 'query'}},
        returns: {arg: 'data', type: 'Array'},
      }
    );
  
  Project.remoteMethod
  (
    'ConsolidateToolsAndEquipment',
      {
        http: {verb: 'get'},
        description: 'Get list of man power by project',
        accepts: {arg: 'toolsAndEquipmentId', description: 'Tools And Equipment Id', type: 'number', http: {source: 'query'}},
        returns: {arg: 'data', type: 'Array'},
      }
    );
};
