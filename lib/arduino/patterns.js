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
  }

  if(invert){
    frames = frames.slice().map(function(p){ return p.slice().reverse(); }).reverse().concat(frames);
  }

  return frames;
};

module.exports = {
  chaseBlue : function(options){
    if(!options){ options = {}; }
    var pattern = chaserPattern(blue, 3, 0, false);
    return new LedActionPattern(
      pattern,
      _.defaults(options, {
        frameTime : 50,
        interval : 5000,
        name: "chaseBlue"
      })
    );
  },
  chaseRed : function(options){
    if(!options){ options = {}; }
    var pattern = chaserPattern(red, 3, 0, false);
    return new LedActionPattern(
      pattern,
      _.defaults(options, {
        frameTime : 50,
        interval : 5000,
        name: "chaseRed"
      })
    );
  },
  chaseGreen : function(options){
   if(!options){ options = {}; }
   var pattern = chaserPattern(green, 3, 0, false);
   return new LedActionPattern(
     pattern,
     _.defaults(options, {
       frameTime : 50,
       interval : 5000,
       name: "chaseGreen"
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
  circleRGB : function(options){
    if(!options){ options = {}; }
    var colors = [red, black, black, green, black, black, blue, black, black, pink, black, black];
    var frames = []
    for(var i = 0; i < colors.length; i++){
      frames.push(colors)
      colors = colors.slice();
      colors.unshift(colors.pop());
    }
    return new LedActionPattern(
      frames,
      _.defaults(options, {
        frameTime : 100,
        interval : 5000,
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
  randomDisco : function(options){
    if(!options){ options = {}; }
    var colors = [black, blue, black, red, black, green, black, pink, black, orange, black, red];
    return new LedActionPattern(
      [
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
        [black],
        _.shuffle(colors),
        [black],
        _.shuffle(colors),
        [black],
        _.shuffle(colors)
      ],
      _.defaults(options, {
        frameTime : 100,
        interval : 5000,
        name: "randomDisco"
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