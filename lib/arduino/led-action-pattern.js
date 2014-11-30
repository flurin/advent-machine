var Promise = require('promise');
var wait = require('../wait');

// pattern = [
//  [c1, c2, c3] // Frame: -> Intrapolate over leds
//  [c1] // Frame: -> Intrapolate over leds
// ]
// frameTime: Time each frame is shown
// intervalTime: Time between 2 patterns
// name: optional effect name
var Pattern = function(patterns, frameTime, intervalTime, name){
  this.led = null;
  this.patterns = patterns;
  this.frameTime = frameTime;
  this.interval = intervalTime;
  this.name = name;
  this.run = false;
  this.timer = null;
}

Pattern.prototype.intrapolatePatterns = function(patterns){
  return patterns.map(function(pattern){
    if(pattern.length < this.led.length){
      var newPattern = []
      for(var i=0; i < this.led.length; i++){
        newPattern[i] = pattern[i % pattern.length];
      }
      return newPattern;
    } else {
      return pattern;
    }
  }.bind(this));
}

Pattern.prototype.action = function(){
  if(!this.led){
    throw new Error("No led object assigned");
  }

  // Prepare pattern
  this.intrapolatedPatterns = this.intrapolatePatterns(this.patterns);

  var self = this;

  var perform = function(){
    console.log("LedActionPattern: PERFORM", self.name, self.run);
    var patternSequence = Promise.resolve();
    self.intrapolatedPatterns.forEach(function(pattern){
      patternSequence = patternSequence.then(function(){
        return setLeds(self.led, pattern);
      }).then(function(){
        return wait(self.frameTime);
      });
    });

    patternSequence.then(function(){
      if(self.run){
        self.timer = setTimeout(perform, self.interval);
      }
    }).catch(function(err){
      console.log(err.stack);
    });

    return patternSequence;
  }

  perform();
}

// led = the FastLED object to operate on
Pattern.prototype.start = function(led){
  this.led = led;
  this.run = true;
  this.action();
}

Pattern.prototype.stop = function(){
  this.run = false;
  clearTimeout(this.timer);
  console.log("LedActionPattern: STOP", this.run);
}

// Set all leds to colors in the colors array.
var setLeds = function(led, colors){
  colors.forEach(function(color, i){
    led.setColor(i, color);
  });
  return led.show();
};

module.exports = Pattern;
