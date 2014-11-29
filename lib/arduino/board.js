var Five = require("johnny-five");
var Promise = require('promise');
var FastLED = require("../fastled");
var EventEmitter = require('events').EventEmitter;


module.exports = function(config){
  var board = new Five.Board({ repl: false });
  var events = new EventEmitter();
  var started = false;

  var button, led;

  var ledInterval;
  var ledStack = [];

  var wait = function(milis){
    return new Promise(function(resolve, reject){
      return setTimeout(resolve, milis);
    });
  }

  // colors = Color
  // colors = [Color1, Color2] -> Intrapolate over all leds. So for 3 leds you get c1,c2,c1
  // fadeTime = time from (black -> color -> black)
  // intervalTime = starttime between 2 fades
  // decay = slow down factor: intervalTime = intervalTime * decay; decay = 1 == no decay
  var pulseLeds = function(colors, fadeTime, intervalTime, decay){
    if(!started){ throw new Error("The board has not yet started"); }


  }

  // pattern = [
  //  [c1, c2, c3] // Frame: -> Intrapolate over leds
  //  [c1] // Frame: -> Intrapolate over leds
  // ]
  // frameTime: Time each frame is shown
  // intervalTime: Time between 2 patterns
  var patternLeds = function(patterns, frameTime, intervalTime){
    if(!started){ throw new Error("The board has not yet started"); }
    if(ledInterval){ stopLeds(); }

    // Add myself to stack.
    ledStack.push(patternLeds, arguments);

    var intrapolatedPattern = patterns.map(function(pattern){
      if(pattern.length < led.length){
        var newPattern = []
        for(var i=0; i < led.length; i++){
          newPattern[i] = pattern[i % pattern.length];
        }
        return newPattern;
      } else {
        return pattern;
      }
    });

    var showPattern = function(){

      var patternSequence = Promise.resolve();
      intrapolatedPattern.forEach(function(pattern){

        patternSequence = patternSequence.then(function(){
          return setLeds(pattern);
        }).then(function(){
          return wait(frameTime);
        });
      });

      patternSequence.then(function(){
        ledInterval = setTimeout(showPattern, intervalTime);
      });

      return patternSequence;
    }

    showPattern();
  }

  // Pop an action of the stack.
  var popLeds = function(){
    stopLeds();
    ledStack.pop();
    if(ledStack.length > 0){
      var action = ledStack[ledStack.length - 1]
      action[0].apply(action[0],action[1]);
    }
  }

  var stopLeds = function(){
    clearTimeout(ledInterval);
    ledInterval = null;
  }

  var clearLeds = function(){
    ledStack = [];
    stopLeds();
  }

  // Colors = array of colors to set
  var setLeds = function(colors){
    colors.forEach(function(color, i){
      led.setColor(i, color);
    });
    return led.show();
  };

  var start = function(){
    return new Promise(function(resolve, reject){
      board.on("ready", function() {

        button = new Five.Button({
          pin: config.boardConfig.buttonPin || 2,
          isPullup: true
        });

        led = new FastLED(board.io, config.boardConfig.ledCount || 12);

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
    popLeds : popLeds,
    patternLeds : patternLeds,
    pulseLeds : pulseLeds,
    stopLeds : stopLeds,
    board: board,
    start: start
  }
}