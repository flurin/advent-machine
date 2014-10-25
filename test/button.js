var Five = require("johnny-five");
var Promise = require('promise');
var sys = require('sys')
var exec = require('child_process').exec;

var board = new Five.Board();
var button;

var sentences = [
  "Dumbass!",
  "Segga is a stupidass",
  "Bli, bla, blu",
  "Beunhaas!"
]

board.on("ready", function() {
  button = new Five.Button({
    pin: 2,
    isPullup: true
  });

  // "down" the button is pressed
  button.on("down", function() {
    console.log("Down");
    var s = sentences[Math.round(Math.random() * (sentences.length - 1) )]
    console.log(s);
    exec("say " + s);
  });

});