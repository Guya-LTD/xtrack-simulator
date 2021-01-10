var fs = require('fs');
var Papa = require('papaparse');
var dotenv = require('dotenv').config()

// Const Vars
// Max number of drivers to simulate
const MAX_NO_TO_SIMULATE = 3;
// Start id for drivers
const START_ID = 1050
// Waypoints folder name
const WAYPOINTS_FOLDER_NAME = 'waypoints/';
// File type
const FILE_TYPE = '.csv';

simulator = (id) => {
    var dirverQuery = 'name=admin' + id + '&type=deiver';
    var socket = require('socket.io-client')(process.env.XTRACK_URL, {forceNew: true, query: dirverQuery});

    // Lifecycle 1
    socket.on('connect', function() {
        // On connection open
        console.log("Connection Established: " + id);
        // Create driver object
        socket.emit('driver:connection:join');
        
        // Set Variables for this socket connection
        var count = 0;
        var exit_interval = false;
        var data = {};

        // Csv file reader streamer
        var file_name = WAYPOINTS_FOLDER_NAME + id + FILE_TYPE;
        var file = fs.createReadStream(file_name);

        // Read waypoints
        Papa.parse(file, {
            //worker: true, // Don't bog down the main thread if its a big file
            header: true,
            dynamicTyping: true,
            complete: function(results, file) {
               data = results.data;
            }
        });

        // Update location every 4 second
        setInterval(() => {
            // Check if exit_interval and exit
            if(exit_interval) clearInterval(this);

            // Check if the data is the last and if so exit the time interval
            // Restart it
            if(data.length == count) count = 0;

            var coordinate = {
                name: 'admin' + id,
                longitude: data[count].longitude,
		        latitude: data[count].latitude
            }

            socket.emit('location:update', coordinate)
            //console.log(" ID => " + id + " Coordinates => " + coordinate)

            count++;
        }, 400);

    })

    // Lifecycle 2
    // after a given delay, the client tries to reconnect
    socket.on('reconnect_attempt', () => {
        console.log(id + " Connection Error, Retrying..." + process.env.XTRACK_URL)
    });

    // Lifecycle 3
    // the first attempt fails
    socket.on('reconnect_error', () => {
        console.log(id + " Retrying Failed")
    });

    // Lifecycle 4
    // the client won't try to reconnect anymore
    socket.on('reconnect_failed', () => {
        console.log(id + " Connection Failed, Closing connection")
    });
 
    // Lifecycle last
    socket.on('disconnect', function() {
        console.log("Connection closed For => " + id);
    })

    socket.on('error', function(error) {
        console.log(error);
        socket.close()
        setTimeout(() => {
            startSimulator();
        }, 3000);
    })

}

console.log("Simulator Started");

function startSimulator() {
    for (var i = 2; i < MAX_NO_TO_SIMULATE; i++){
        simulator(i);
    }
}

startSimulator();