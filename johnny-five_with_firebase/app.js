// create a new board 
var five = require("johnny-five");
five.Board().on("ready", function() {
    // create a new `motion` hardware instance
    var motion = new five.Motion(2);


    // setup firebase
    var firebase = require("firebase");
    firebase.initializeApp ({
        databaseURL: "https://test-firebase-d909d.firebaseio.com"
    });
    var db = firebase.database();

    // set up command channel for client to communicate with server
    var commandRef = db.ref("/Command");


    // set up motion channel to record motion data
    var testsRef = db.ref("/Tests");



    commandRef.on("value", function(snapshot){
        var commands = snapshot.val();
        if (commands['Test'] == 'on'){
            console.log('start test')

            motion.on("calibrated", function() {
                console.log("calibrated");
            });

            motion.on('motionstart', function() {
                // record time of motion detected
                console.log('motion detected')
            });

            motion.on('motionend', function(){
                console.log('motion ended')
                var send_time = Date.now();
                console.log(send_time)
                testsRef.once("value", function(snapshot){
                    var tests = snapshot.val();
                    testsRef.update({
                        '/send_time':send_time,
                    });
                });
            });
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code)
    });
});