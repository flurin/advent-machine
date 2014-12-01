var Color = require("color");
var _ = require('lodash');

var LedActionPattern = require("./led-action-pattern");

var red = Color().rgb(255, 0, 0);
var green = Color().rgb(0, 255, 0);
var blue = Color().rgb(0, 0, 255);
var black = Color().rgb(0, 0, 0);

var ledCount = 12;

var chaserPattern = function(color, rounds, fade){
  var frames = [];

  var blackFrames = _.range(ledCount).map(function(){ return black; });

  var cc = color.clone();

  for(var r = 0; r < rounds; r++){
    for(var l = 0; l < ledCount; l++){
      var frame = blackFrames.slice();
      frame[l] = cc
      frames.push(frame);
    }
    cc = cc.clone().darken(fade);
  }

  return frames;
}

module.exports = {
  fadingChaser3Blue : function(options){
    if(!options){ options = {}; }
    var pattern = chaserPattern(blue, 3, 0.5)
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