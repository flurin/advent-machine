var Color = require("color");
var LedActionPattern = require("./led-action-pattern");

var red = Color().rgb(255, 0, 0);
var green = Color().rgb(0, 255, 0);
var blue = Color().rgb(0, 0, 255);
var black = Color().rgb(0, 0, 0);

module.exports = {
  blinkRed : function(frameTime, intervalTime){
    return new LedActionPattern(
      [
        [red],
        [black]
      ],
      frameTime || 100,
      intervalTime || 200,
      "blinkRed"
    )
  },
  disco : function(frameTime, intervalTime){
    return new LedActionPattern(
      [
        [red, green, blue],
        [black],
        [green, blue, red],
        [black],
        [blue, red, green],
        [black]
      ],
      frameTime || 500,
      intervalTime || 5000,
      "disco"
    )
  }
}