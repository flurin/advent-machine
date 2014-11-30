var Five = require("johnny-five");
var Promise = require('promise');
var FastLED = require("../fastled");
var EventEmitter = require('events').EventEmitter;

var ledActions = require('./led-actions');

module.exports = function(config){
  var board = new Five.Board({ repl: false });
  var events = new EventEmitter();
  var started = false;

  var button, led;

  // Blink 1st led green once.
  var initFeedback = function(){
    led.set(1, 0, 255, 0);
    led.show();
    setTimeout(function(){
      led.set(1, 0, 0, 0);
      led.show();
    }, 500);
  };

  var start = function(){
    return new Promise(function(resolve, reject){
      board.on("ready", function() {

        button = new Five.Button({
          pin: config.boardConfig.buttonPin || 2,
          isPullup: true
        });

        led = new FastLED(board.io, config.boardConfig.ledCount || 12);
        ledActions.setLed(led);

        initFeedback();

        button.on("down", function(){
          events.emit("buttonDown");
        });

        started = true;
        resolve(board);
      });

    })
  }

  return {
    on : function(){
      return events.on.apply(events, arguments);
    },
    popLedAction : ledActions.pop,
    pushLedAction : ledActions.push,
    board: board,
    start: start
  }
}