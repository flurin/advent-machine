var Color = require("color");
var LedActionPattern = require("./led-action-pattern");

var red = Color().rgb(255, 0, 0);
var green = Color().rgb(0, 255, 0);
var blue = Color().rgb(0, 0, 255);
var black = Color().rgb(0, 0, 0);

module.exports = {
  blinkRed : function(){
    new LedActionPattern(
      [
        [red],
        [black]
      ],
      100,
      200,
      "blinkRed"
    )
  },
  disco : function(){
    new LedActionPattern(
      [
        [red, green, blue],
        [black],
        [green, blue, red],
        [black],
        [blue, red, green],
        [black]
      ],
      500,
      5000,
      "disco"
    )
  }
}