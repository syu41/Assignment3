var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
    console.log("Connected");
})
server.listen(8080, function() {
    console.log('Listening at: http://localhost:8080');
});

// initialize board 
var five = require("johnny-five");
var led;
var motion;
var board = new five.Board();
board.on("ready", function() {
    // create a new 'LED' instance
    led = new five.Led(13);
    // create a new `motion` hardware instance
    motion = new five.Motion(2);
});

// create socket
var socket = require('socket.io').listen(server);
socket.on('connection', function(socket){
    socket.on("test", function(){
        console.log("start test")
        var emit_time

        // "calibrated" occurs once, at the beginning of a session
        motion.on("calibrated", function() {
            console.log("calibrated");
        });

        // "motionstart" events are fired when the "calibrated"
        // proximal area is disrupted, generally by some form of movement
        motion.on("motionstart", function() {
            led.on();
            console.log("motionstart");
        });

        motion.on('motionend', function() {
            led.off();
            console.log('motion end')
            emit_time = Date.now();
            console.log(emit_time);
            socket.emit("emit_time", {'emit_time':emit_time});
        });
    });

});
