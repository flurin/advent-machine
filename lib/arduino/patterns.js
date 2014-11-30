var Color = require("color");
var _ = require('lodash');

var LedActionPattern = require("./led-action-pattern");

var red = Color().rgb(255, 0, 0);
var green = Color().rgb(0, 255, 0);
var blue = Color().rgb(0, 0, 255);
var black = Color().rgb(0, 0, 0);

module.exports = {
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