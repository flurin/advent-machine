var Color = require("color");
var _ = require('lodash');

var LedActionPattern = require("./led-action-pattern");

var red = Color().rgb(255, 0, 0);
var green = Color().rgb(0, 255, 0);
var blue = Color().rgb(0, 0, 255);
var pink = Color().rgb(255,0,255);
var orange = Color().rgb(255,127,0);
var black = Color().rgb(0, 0, 0);

var ledCount = 12;

var chaserPattern = function(color, rounds, fade, invert){
  var frames = [];

  var blackFrames = _.range(ledCount).map(function(){ return black; });

  for(var r = 0; r < rounds; r++){
    for(var l = 0; l < ledCount; l++){
      var frame = blackFrames.slice();
      var darken = (((r + 1) * (l + 1)) / (rounds * ledCount)) * fade;
      frame[l] = color.clone().darken(darken);
      frames.push(frame);
    }
    frames.push(blackFrames.slice());

  }

  if(invert){
    frames = frames.slice().map(function(p){ return p.slice().reverse(); }).reverse().concat(frames);
  }

  return frames;
};

module.exports = {
  chaseBlue : function(options){
    if(!options){ options = {}; }
    var pattern = chaserPattern(blue, 1, 0, false);
    return new LedActionPattern(
      pattern,
      _.defaults(options, {
        frameTime : 50,
        interval : 50,
        name: "chaserBlue"
      })
    );
  },
  circleBlue : function(options){
    if(!options){ options = {}; }
    return new LedActionPattern(
      [
        [blue, black, black],
        [black, blue, black],
        [black, black, blue]
      ],
      _.defaults(options, {
        frameTime : 50,
        interval : 50,
        name: "circleBlue"
      })
    );
  },
  circleRed : function(options){
    if(!options){ options = {}; }
    return new LedActionPattern(
      [
        [red, black, black],
        [black, red, black],
        [black, black, red]
      ],
      _.defaults(options, {
        frameTime : 50,
        interval : 50,
        name: "circleRed"
      })
    );
  },
  blinkRed : function(options){
    if(!options){ options = {}; }
    return new LedActionPattern(
      [
        [red],
        [black]
      ],
      _.defaults(options, {
        frameTime : 100,
        interval : 200,
        name: "blinkRed"
      })
    );
  },
  discoSquares : function(options){
    if(!options){ options = {}; }
    var colors = [black, blue, black, red, black, green, black, pink, black, orange, black, red];
    return new LedActionPattern(
      [
        [black, red, black],
        [black],
        [black],
        [pink, black, pink],
        [black],
        [black],
        [black, blue, black],
        [black],
        [black],
        _.shuffle(colors),
        [black],
        _.shuffle(colors),
        [black],
        _.shuffle(colors),
        [black],
        _.shuffle(colors),
        [black],
        _.shuffle(colors),
        [black],
        _.shuffle(colors),
        [black],
        _.shuffle(colors),
      ],
      _.defaults(options, {
        frameTime : 50,
        interval : 5000,
        name: "discoSquares"
      })
    );
  },
  disco : function(options){
    if(!options){ options = {}; }
    return new LedActionPattern(
      [
        [red, green, blue],
        [black],
        [green, blue, red],
        [black],
        [blue, red, green],
        [black]
      ],
      _.defaults(options, {
        frameTime : 200,
        interval : 5000,
        name: "disco"
      })
    );
  }
};