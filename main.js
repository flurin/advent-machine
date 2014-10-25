var Five = require("johnny-five");
var NeoPixel = require("./neopixel");
var Color = require("color");
var Promise = require('promise');

var board = new Five.Board();
var pixel, button;
var stripSize = 4;

var colors = [
  new Color().rgb(100,0,0),  
  new Color().rgb(255,0,0),
  new Color().rgb(0,255,0),
  new Color().rgb(0,0,255),
  new Color().rgb(127,0,0),
  new Color().rgb(0,127,0),
  new Color().rgb(0,0,127),  
  new Color().rgb(0,127,255),  
  new Color().rgb(255,0,255),  
  new Color().rgb(255,255,255),    
  new Color().rgb(0,0,0),  
  new Color().rgb(255,0,255),
  new Color().rgb(0,0,0),  
  new Color().rgb(0,127,255),
  new Color().rgb(0,255,255),
  new Color().rgb(0,0,0),    
]

// var colors = [
//   new Color().rgb(0,0,255),
//   new Color().rgb(0,0,50),
//   new Color().rgb(0,0,255),
//   new Color().rgb(0,0,50),
//   new Color().rgb(0,0,255)
// ]


var nextColor = 0;

var pixelColors = [];

//  Initialize all pixels to black.
for(var i=0; i < stripSize; i++){
  pixelColors[i] = new Color().rgb(0,0,0);
}

// col1, col2 = Color objects
// time = in ms
// callback = callback(color)
var fadeFromTo = function(col1, col2, time, callback){
  return new Promise(function(fullfill, reject){
    var maxSteps = 255;
    var steps = maxSteps;
    var wait = time/steps;
    var weight = 0;

    var iter = function(){
      steps = steps - 1;

      if(steps == 0){
        weight = 1;
      } else {
        weight = 1 - steps/maxSteps;
      }

      callback(col1.clone().mix(col2, weight));

      if(steps > 0){
        setTimeout(iter, wait);
      } else {
        fullfill();
      }
    }

    iter();
  })
}

var debugColors = function(colors){
  console.log(colors.map(function(c){ return c.rgbArray(); }))
}

var faders = {}

var fadePixel = function(i, from, to){
  if(faders[i]){ 
    console.log("already fading pixel ", i)
    return; 
  }

  faders[i] = true;
  fadeFromTo(from, to, 2000, function(fadeColor){
    pixel.set(i, fadeColor.red(), fadeColor.green(), fadeColor.blue());
    pixel.show();
  }, function(){
    faders[i] = false;
  });    
}

var nextPixel = function(){
  var origColors = pixelColors.slice(0);

  pixelColors.pop();
  pixelColors.unshift(colors[nextColor]);

  console.log("NEXT", colors[nextColor].rgbArray(), pixelColors.length);

  for(var i=0; i < pixelColors.length; i++){
    if(origColors[i].rgbArray() != pixelColors[i].rgbArray()){
      fadePixel(i, origColors[i], pixelColors[i]);  
    }
  }

  nextColor += 1;
  if(nextColor >= colors.length){
    nextColor = 0;
  }
};

var currentColor = -1;
var nextColor = function(){
  var from = colors[currentColor];
  if(!from){
    from = new Color().rgb(0,0,0);
  }
  
  currentColor += 1;
  if(currentColor >= colors.length){
    currentColor = 0;
  }

  var to = colors[currentColor];

  console.log(currentColor, from.rgbArray(), to.rgbArray());

  fadeFromTo(from, to, 1000, function(color){
    for(var i=0; i < stripSize; i++){
      pixel.set(i, color.red(), color.green(), color.blue());
    }
    pixel.show();
  });
}

var pulse = function(){

}

board.on("ready", function() {
  pixel = new NeoPixel(board.io, 7);
  button = new Five.Button({
    pin: 2,
    isPullup: true
  });

  pixel.config(stripSize, NeoPixel.TYPE.NEO_RGB + NeoPixel.TYPE.NEO_KHZ800);

  // Turn all pixels off
  pixel.show();

  var setAll = function(color){
    pixel.set(0, color.red(), color.green(), color.blue());
    pixel.set(1, color.red(), color.green(), color.blue());
    pixel.set(2, color.red(), color.green(), color.blue());
    pixel.set(3, color.red(), color.green(), color.blue());    
    pixel.show();    
  }

  pixel.set(0,255,0,0);
  pixel.set(1,0,255,0);
  pixel.set(2,0,0,255);
  pixel.show();

  // pixel.set(0,5,0,0);
  // pixel.show();

  // pixel.set(0,255,0,0);
  // pixel.show();

  // var t = 500;
  // var tAll = t * colors.length;
  // setInterval(function(){
  //   console.log("Next");
  //   var from = colors[0], to = colors[1];
  //   var chain = fadeFromTo(from, to, t, setAll);
  //   for(var i=2; i < colors.length; i++){
  //     (function(i){
  //       chain = chain.then(function(){ 
  //         // console.log(i);
  //         // console.log(i, colors[i-1].rgbArray(), colors[i].rgbArray());  
  //         return fadeFromTo(colors[i-1], colors[i], t, setAll) 
  //       });
  //     })(i);
  //   }
  //   chain.catch(function(err){
  //     console.log(err);
  //   })
  // }, tAll)


  // "down" the button is pressed
  button.on("down", function() {
    console.log("Down");
     // nextPixel(pixel);
     nextColor();
  });

  board.repl.inject({
    pixel: pixel
  });


});