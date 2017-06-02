var path = require('path');
var app = require(path.resolve(__dirname, './server'));
var models = app.models;

var accounts = [
    {
        name: 'Alex Fernandez',
        username: 'afernandez',
        email: 'olorenzo@outlook.com',
        password: '123456',
        createdAt: new Date(),
        modifiedAt: new Date()
    },
    {
        name: 'Carlos Lopez',
        username: 'clopez',
        email: 'cyber_heroe@unitec.edu',
        password: '123456',
        createdAt: new Date(),
        modifiedAt: new Date()
    }
];

//Users Seed
var Account = app.models.Account;
Account.create(accounts, function (err, records) {
    if (err) 
        throw err; //create the admin role
    var Role = app.models.Role;
    Role.create({
        name: 'admin'
    }, function (err, role) {
        if (err) 
            throw err; //make Alex an admin
        var RoleMapping = app.models.RoleMapping;
        role
            .principals
            .create({
                principalType: RoleMapping.USER,
                principalId: records[0].id
            }, function (err, principal) {
                if (err) 
                    throw err;
                }
            );
    });
    console.log('Record created:', records);
});



//Example to create more seeds
//Select the code below and hold ctrl press 'k' and then press 'c'
// var phoneTypes = [
//     {
//         description: 'home'
//     }, {
//         description: 'mobile'
//     }
// ];
// //phoneTypes Seed
// var PhoneType = app.models.PhoneType;
// PhoneType.create(phoneTypes, function (err, records) {
//     if (err) 
//         throw err;
//     console.log("phoneTypes created!")
// }); //genders Seed
