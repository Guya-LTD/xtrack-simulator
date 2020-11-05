var Papa = require('papaparse');
var fs = require('fs');

var file = fs.createReadStream('waypoints/1.csv');
//var file = 'waypoints/1.csv';

var CsvRead = Papa.parse(file, {
    //worker: true, // Don't bog down the main thread if its a big file
    header: true,
    dynamicTyping: true,
    complete: function(results, file) {
        console.log(results.data[0].latitude);
    }
});
