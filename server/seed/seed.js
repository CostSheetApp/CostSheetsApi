var path = require('path');
//var app = require(path.resolve(__dirname, '../server'));



//var models = app.models;


module.exports = {
    AddJobs: function(model,jobs) {
        model.create(jobs, function(err, res) {
            if (err) {
                throw err;
                //return false
            }

            return true;
        });
    },
    AddRegions: function(model,regions) {
        model.create(regions, function(err, res) {
            if (err) {
                throw err;
                //return false
            }
            return true;
        });
    }
};

// var CreateUnitsOfMeasurement = () => {
//     var UnitsOfMeasurement = app.models.UnitsOfMeasurement;
//     //UnitsOfMeasurement seed
//     UnitsOfMeasurement.create(UoM, function (err, records) {
//         if (err) 
//             throw err;
//         console.log("UnitsOfMeasurement created");
//     });
// }

// var CreateEntity = (entity) => {
//     //Accounts Seed
//     var Entity = app.models.Entity;
//     Entity.create(entity, function (err, res) {
//         if (err) 
//             throw err; //create the admin role
//         // var Role = app.models.Role;
//         // Role.create({
//         //     name: 'admin'
//         // }, function (err, role) {
//         //     if (err) 
//         //         throw err; //make Alex an admin
//         //     var RoleMapping = app.models.RoleMapping;
//         //     role
//         //         .principals
//         //         .create({
//         //             principalType: RoleMapping.USER,
//         //             principalId: records[0].id
//         //         }, function (err, principal) {
//         //             if (err) 
//         //                 throw err;
//         //             }
//         //         );
//         // });
//         console.log('Record created:', records);
//     });
// }


// var AddRegionsToEntity = (entity)=>{

// }
