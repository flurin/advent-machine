// Config
var config = {
  trelloConfigPath : __dirname + "/trello-conf.json",
  publicPath : __dirname + '/public',
  port: 3000,
  scheduleInterval : 5000,
  messages : null,
  queue : null,
  boardConfig : {
    buttonPin : 1,
    ledCount: 12
  },
  printerConfig : {
    port: '/dev/ttyAMA0',
    printerOptions : {
      maxPrintingDots : 7,
      heatingTime : 200,
      heatingInterval : 200,
      commandDelay: 200
    }
  }
}

config.trello = require(config.trelloConfigPath);

config.messages = require("./lib/trello/messages")(config);
config.queue = require("./lib/trello/queue")(config);
config.printer = require("./lib/printer")(config);


// Server
var Server = require("./lib/server")(config);

// Scheduler
var Scheduler = require("./lib/scheduler")(config);

// Board
var Board = require("./lib/arduino/board")(config);

Scheduler.on("schedule", function(message){
  // Pulse leds
})

var busy = false;
Board.on("buttonDown", function(){
  if(busy){ return; }
  busy = true;
  config.queue.unshift().catch(function(err){
    if(err == "no_messages"){
      return config.messages.getRandomImpatience();
    } else {
      throw err;
    }
  }).then(function(message){
    console.log("PRINT MESSAGE", message);

    // Board.pulseLeds();
    busy = false;
  });
})

// Start the whole shebang
Board.start().then(function(){
  return Scheduler.start();
}).then(function(){
  return Server.start();
})
