var Five = require("johnny-five");
var Promise = require('promise');
var FastLED = require("../fastled");
var EventEmitter = require('events').EventEmitter;


module.exports = function(config){
  var board = new Five.Board();
  var events = new EventEmitter();
  var started = false;

  var pulseLeds = function(colors, speed, interval, decay){
    if(!started){ return false; }

  }

  var start = function(){
    return new Promise(function(resolve, reject){
      board.on("ready", function() {

        var button = new Five.Button({
          pin: config.boardConfig.buttonPin || 1,
          isPullup: true
        });

        var led = new FastLED(board.io, config.boardConfig.ledCount || 12);

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
    board: board,
    start: start
  }
}