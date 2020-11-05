var Papa = require('papaparse');

simulator = (id) => {
    var socket = require('socket.io-client')(process.env.XTRACK_URL, {forceNew: true});
    socket.on('connect', function() {
        // On connection open
        
        // Set Variables for this socket connection
        var count = 0;
        var exit_interval = false;

        // Update location every 4 second
        setInterval(() => {
            // Check if exit_interval and exit
            if(exit_interval) clearInterval(this);
            
            var longlat = ;

            socket.emit('location:update', longlat)
        }, 400);
    })
    
}

// Const Vars
// Max number of drivers to simulate
const MAX_NO_TO_SIMULATE = 10;

for (var i = 0; i < MAX_NO_TO_SIMULATE; i++){
    simulator(i);
}