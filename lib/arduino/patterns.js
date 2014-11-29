var Color = require("color");

var red = Color().rgb(255, 0, 0);
var green = Color().rgb(0, 255, 0);
var blue = Color().rgb(0, 0, 255);
var black = Color().rgb(0, 0, 0);

module.exports = {
  blinkRed : [
    [red],
    [black]
  ],
  disco : [
    [red, green, blue],
    [black],
    [green, blue, red],
    [black],
    [blue, red, green],
    [black]
  ]
}