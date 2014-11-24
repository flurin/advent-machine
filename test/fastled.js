var Five = require("johnny-five");
var FastLED = require("../lib/fastled");
var Promise = require('promise');
var Color = require("color");
var fader = require("../lib/color_fade");

var chaser = [
  new Color().rgb(255,0,0),
  new Color().rgb(0,255,0),
  new Color().rgb(0,0,255),
  new Color().rgb(255,255,0),
  new Color().rgb(255,0,255),
  new Color().rgb(0,255,255),
  new Color().rgb(255,255,255),  
]

var black = new Color().rgb(0,0,0);

var wait = function(milis){
  return new Promise(function(resolve, reject){
    return setTimeout(resolve, milis);
  });
}

var sequencer = function(){
  var sequence = Promise.resolve();

  for(var i=0; i < chaser.length; i++){
    for(var j=0; j < led.length; j++){
      (function(i,j){
        sequence = sequence.then(function(){ 
          return wait(100); 
        }).then(function(){

          for(var p=0; p < led.length; p++){
            if(p < j - 1 || p >  j + 1){
              led.setColor(p, black);
            }
          }

          faded = chaser[i].clone().mix(black, 0.9)

          if(j - 1 >= 0){
            led.setColor(j - 1, faded);
          } 

          led.setColor(j, chaser[i]); 

          if(j + 1 < led.length){
            led.setColor(j + 1, faded);
          }                

          led.show(); 
        })
      })(i, j);
    }
  }
  sequence.then(function(){
    // console.log("dunn");
    // led.reset();
    sequencer();
  });

  return sequence;  
}

var board = new Five.Board();
board.on("ready", function() {
  led = new FastLED(board.io, 12);

  var sequence = sequencer();
  // var color = new Color().rgb(255,0,255);
  // console.log(color.clone().mix(black, 0.2).rgbArray());
  // led.setColor(0, color.clone().mix(black, 0.2));
  // led.setColor(1, color.clone().mix(black, 0.5));
  // led.setColor(2, color.clone().mix(black, 0.9));  
  // led.show();



});