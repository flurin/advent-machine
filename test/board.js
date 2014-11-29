var Color = require("color");

// Config
var config = {
  boardConfig : {
    buttonPin : 2,
    ledCount: 12
  }
}

var board = require("../lib/arduino/board")(config);



board.start().then(function(b){

  var red = Color().rgb(255, 0, 0);
  var green = Color().rgb(0, 255, 0);
  var blue = Color().rgb(0, 0, 255);
  var black = Color().rgb(0, 0, 0);

  var pattern = [
    [red],
    [black],
    [red, green],
    [black],
    [red, green, blue]
    [black],
    [blue]
  ]

  b.patternLeds(pattern, 500, 0);

});