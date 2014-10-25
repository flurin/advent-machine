var Five = require("johnny-five");
var FastLED = require("../fastled");
var Promise = require('promise');
var Color = require("color");
var fader = require("../color_fade");

var chaser = [
  new Color().rgb(255,0,0),
  new Color().rgb(0,255,0),
  // new Color().rgb(0,0,255),
  // new Color().rgb(255,255,0),
  // new Color().rgb(255,0,255),
  // new Color().rgb(0,255,255),
  // new Color().rgb(255,255,255),  
]

var black = new Color().rgb(0,0,0);

var wait = function(milis){
  return new Promise(function(resolve, reject){
    return setTimeout(resolve, milis);
  });
}

var pulse = function(n){
  var sequence = Promise.resolve();
  var counter = 100;
  var sequenceCounter = counter * led.length;
  for(var i=0; i < sequenceCounter; i++){
    (function(i){
      sequence = sequence.then(function(){ return wait(16); }).then(function(){    
        for(var iN=0; iN < led.length; iN++){
          var shift = iN * counter;

          if(i >= shift && i < shift + counter){
            var c = i - shift;
            var co = (Math.sin((c - counter/4) * (Math.PI/(counter/2))) + 1)/2;
            var mix = led.values[iN] && new Color().rgb(led.values[iN]) || black;
            mix = black;
            var col = chaser[n].clone().mix(mix, 1 - co);
            led.setColor(iN, col);  
          } else if( i > shift + counter){
            // led.setColor(iN, chaser[n]);              
          }
          // var co = Math.abs(Math.sin(i * (Math.PI/counter)));
          // var co = (Math.sin((i - counter/4) * (Math.PI/(counter/2))) + 1)/2;
          // var col = chaser[n].clone().mix(black, 1 - co);
          // led.setColor(iN, col);  
        }
        
        led.show();
        return;
      }, function(err){ console.log(err); })   
    })(i);
  }

  return sequence;
};

var pulser = function(){
  var seq = Promise.resolve();
  for(var i = 0; i < chaser.length; i++){
    (function(i){
      seq = seq.then(function(){
        return pulse(i);
      })
    })(i);
  }
  return seq.then(function(){
    return pulser();
  })
  // pulse(0).then(function(){ return pulse(1); }).then(function(){ return pulser(); });
}

var board = new Five.Board();
board.on("ready", function() {
  led = new FastLED(board.io, 4);

  // pulse(0).then(function(){ pulse(1); });
  pulser();

  // led.set(0, 50, 127, 00);
  // // led.set(1, 0, 0, 255);
  // led.show();

  board.repl.inject({
    led: led
  });


});