var path = require('path'); 
var app = require(path.resolve(__dirname, '../server'));
var UoMs = require('./data/UnitsOfMeasurement');

app.models.UnitsOfMeasurement.create(UoMs, function(err, res) {
    if (err) {
        throw err;
    }

    return true;
//console.log('Record created:', records);
});