var Promise = require('promise');
var _ = require('lodash');

var logger = require("./lib/logger");
var argv = require('minimist')(process.argv.slice(2), {boolean: true});

// Config
var config = {
  trelloConfigPath : __dirname + "/trello-conf.json",
  publicPath : __dirname + '/public',
  port: 3000,
  scheduleInterval : 300*1000,
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
};

var ledPatterns = require("./lib/arduino/patterns");

// Config file
config.trello = require(config.trelloConfigPath);

// Core components
config.messages = require("./lib/trello/messages")(config);
config.queue = require("./lib/trello/queue")(config);
config.printer = require("./lib/printer")(config);

// App server (mostly for debugging and testing)
var Server = require("./lib/server")(config);

// Scheduler
var Scheduler = require("./lib/scheduler")(config);

// Board
var Board = require("./lib/arduino/board")(config);

Scheduler.on("schedule", function(message){
  logger.info("Main:", "Schedule message:", message.name);

  var pattern;
  if(message.ledAction && ledPatterns[message.ledAction]){
    pattern = ledPatterns[message.ledAction];
  } else {
    pattern = _.sample(ledPatterns) // Pick a random pattern.
  }

  Board.pushLedAction(pattern());
});

Scheduler.on("immediate", function(message){
  logger.info("Main:", "Print immediate:", message.name);

  config.printer.printMessage(message);
});

var busy = false;
Board.on("buttonDown", function(){
  if(busy){ return; }
  busy = true;

  logger.info("Main:", "Button pressed!");

  // Give feedback.
  Board.popLedAction();
  Board.pushLedAction(ledPatterns.circleBlue());

  config.queue.unshift().catch(function(err){
    if(err.code === "no_messages"){
      Board.popLedAction();
      logger.info("Main: ", "Getting an impatience message");
      Board.pushLedAction(ledPatterns.blinkRed({count: 5}));
      return config.messages.getRandomImpatience();
    } else {
      throw err;
    }
  }).then(function(message){
    logger.info("Main:", "Print message", message.name);
    Board.popLedAction();
    config.printer.printMessage(message);

    busy = false;
  });
});

// Start the whole shebang
Promise.resolve().then(function(){
  if(!argv.noboard){
    // don't start the board if we pass --noboard.
    return Board.start();
  }
}).then(function(){
  return Scheduler.start();
}).then(function(){
  return Server.start();
});
