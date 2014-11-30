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

var ledPatterns = require("./lib/arduino/patterns");

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

  Board.pushLedAction(ledPatterns.disco());
})

Scheduler.on("immediate", function(message){
  console.log("Print", message);
  // config.printer.printMessage(message);
})

var busy = false;
Board.on("buttonDown", function(){
  if(busy){ return; }
  busy = true;

  // Give feedback.
  Board.popLedAction();
  Board.pushLedAction(ledPatterns.circleBlue());

  config.queue.unshift().catch(function(err){
    console.log("got ERR", err.err_msg);
    if(err.err_msg == "no_messages"){
      Board.popLedAction();
      Board.pushLedAction(ledPatterns.blinkRed({count: 2}));
      return config.messages.getRandomImpatience();
    } else {
      throw err;
    }
  }).then(function(message){
    console.log("PRINT MESSAGE", message);
    Board.popLedAction();
    // config.printer.printMessage(message);

    busy = false;
  });
})

// Start the whole shebang
Board.start().then(function(){
  return Scheduler.start();
}).then(function(){
  return Server.start();
})
