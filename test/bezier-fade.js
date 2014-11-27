var express = require('express');
var bodyParser = require('body-parser');
var BezierEasing = require('bezier-easing');

var Five = require("johnny-five");
var FastLED = require("../lib/fastled");
var Promise = require('promise');
var Color = require("color");

var color = new Color().rgb(255,0,0);
var black = new Color().rgb(0,0,0);

var app = express();

//  Middleware
app.use(express.static(__dirname + '/bezier-fade'));
app.use(bodyParser.json());

// Helpers
app.get("/bezier-easing.js", function(req, res){
  res.sendFile("node_modules/bezier-easing/index.js", {root: __dirname + "/../"});
});

// Led functions
app.post("/fade", function(req, res){
  console.log(req.body);
  var points = req.body;

  // p1 = {x:0 , y: 0}
  // p2 = {x:0.5, y: 1}
  // p3 = {x:1 , y: 0}

  var X = function(v){
    return remap(v.x, points.p1.x, points.p2.x, 0, 1);
  }
  var Y = function(v){
    return remap(v.y, points.p1.y, points.p2.y, 0, 1);
  }

  if(led){
    fade(parseInt(points.fadeTime), X(points.cp1), Y(points.cp1), X(points.cp2), Y(points.p2));
  }
});

app.post("/stop", function(req, res){
  stopFade();
});

app.listen(3000);


var board = new Five.Board();
var led;
board.on("ready", function() {
  led = new FastLED(board.io, 12);
});

var wait = function(milis){
  return new Promise(function(resolve, reject){
    return setTimeout(resolve, milis);
  });
}

var calculateFadeColors = function(p1x, p1y, p2x, p2y){
  var fader = BezierEasing(p1x, p1y, p2x, p2y);
  var totalSteps = 255;
  var colors = [];
  for(var i=0; i < totalSteps; i++){
    var v = fader(1 - ((i+1)/totalSteps));
    colors.push(color.clone().mix(black, v));
  }
  return colors.slice().concat(colors.reverse());
}


var currentFade;

function stopFade(){
  if(currentFade){
    clearTimeout(currentFade);
    currentFade = null;
  }

  for(var iN=0; iN < led.length; iN++){
    led.set(iN, 0, 0, 0);
  }
  led.show();
}

function fade(t, p1x, p1y, p2x, p2y){
  var steps = 0;
  var colors = calculateFadeColors(p1x, p1y, p2x, p2y);
  var stepTime = Math.ceil(t/colors.length);
  var stepIncrease = 1;
  var maxStepTime = 16;

  if(stepTime < maxStepTime){
    stepIncrease = Math.floor(maxStepTime/stepTime);
    stepTime = maxStepTime;
  }

  console.log("t", t, "StepTime", stepTime, "stepIncrease", stepIncrease, "colors", colors.length);

  if(currentFade){
    clearTimeout(currentFade);
    currentFade = null;
  }

  var fadeStep = function(){
    if(!currentFade){ return; }

    steps += stepIncrease
    if(steps >= colors.length){
      steps = 0;
    }

    var sequence = Promise.resolve();
    for(var iN=0; iN < led.length; iN++){
      sequence = sequence.then(function(){
        return led.setColor(iN, colors[steps]);
      });
    }
    sequence.then(function(){
      return led.show();
    }).then(function(){
      return led.drain();
    }).then(function(){
      currentFade = setTimeout(fadeStep, stepTime);
    })

  }

  currentFade = true;
  fadeStep();
}

function fade2(t, p1x, p1y, p2x, p2y){
  var fader = BezierEasing(p1x, p1y, p2x, p2y);
  var totalSteps = 255;
  var stepTime = Math.ceil(t/totalSteps);
  var steps = 0;
  var direction = 1;
  var currentColor = black.clone();

  if(currentFade){
    clearTimeout(currentFade);
  }

  var fadeStep = function(){
    var cT = 1 - (steps/totalSteps);
    var v = fader(cT);

    // set the color
    var nC = color.clone().mix(black, v);
    if(nC.rgbString() !== currentColor.rgbString()){
      console.log(nC.rgbArray());
      for(var iN=0; iN < led.length; iN++){
        led.setColor(iN, nC);
      }
      led.show();
      currentColor = nC;
    }

    steps += direction;

    if(steps <= totalSteps && steps > 0){
      currentFade = setTimeout(fadeStep, stepTime);
    } else if (steps > totalSteps || steps <= 0){
      direction = -1 * direction;
      currentFade = setTimeout(fadeStep, stepTime);
    }
  };

  fadeStep();
}


function remap( x, oMin, oMax, nMin, nMax ){
  //range check
  if (oMin == oMax){
      console.log("Warning: Zero input range");
      return None;
  };

  if (nMin == nMax){
      console.log("Warning: Zero output range");
      return None
  }

  //check reversed input range
  var reverseInput = false;
  oldMin = Math.min( oMin, oMax );
  oldMax = Math.max( oMin, oMax );
  if (oldMin != oMin){
      reverseInput = true;
  }

  //check reversed output range
  var reverseOutput = false;
  newMin = Math.min( nMin, nMax )
  newMax = Math.max( nMin, nMax )
  if (newMin != nMin){
      reverseOutput = true;
  };

  var portion = (x-oldMin)*(newMax-newMin)/(oldMax-oldMin)
  if (reverseInput){
      portion = (oldMax-x)*(newMax-newMin)/(oldMax-oldMin);
  };

  var result = portion + newMin
  if (reverseOutput){
      result = newMax - portion;
  }

  return result;
}