// Config
var config = {
  trelloConfigPath : __dirname + "/trello-conf.json",
  publicPath : __dirname + '/public',
  port: 3000,
  scheduleInterval : 10000,
  messages : null,
  queue : null,
  boardConfig : {
    buttonPin : 2,
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
  console.log("Schedule", message);


})

Scheduler.on("immideate", function(message){
  console.log("Print", message);
  config.printer.printMessage(message);
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

    config.printer.printMessage(message);

    busy = false;
  });
})

// Start the whole shebang
Board.start().then(function(){
  return Scheduler.start();
}).then(function(){
  return Server.start();
})
