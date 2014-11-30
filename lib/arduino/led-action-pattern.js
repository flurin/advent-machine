var Promise = require('promise');
var wait = require('../wait');
var _ = require('lodash');

var ids = 0;

// Set all leds to colors in the colors array.
var setLeds = function(led, colors){
  colors.forEach(function(color, i){
    led.setColor(i, color);
  });
  return led.show();
};

// pattern = [
//  [c1, c2, c3] // Frame: -> Intrapolate over leds
//  [c1] // Frame: -> Intrapolate over leds
// ]
// options = {
//  frameTime (50): Time each frame is shown
//  interval (100): Time between 2 patterns
//  name (""): optional effect name
//  count (null): Number of times to run the pattern. null = infinite
// }
var Pattern = function(patterns, options){
  this.led = null;
  this.patterns = patterns;

  this.frameTime = 50;
  this.interval = 50;
  this.name = "";
  this.count = null;

  var validOptionKeys = ['frameTime', 'interval', 'name', 'count'];
  _.extend(this, _.pick(options, validOptionKeys));

  this.run = false;
  this.timer = null;
  ids = ids + 1;
  this.id = ids;
};

Pattern.prototype.intrapolatePatterns = function(patterns){
  return patterns.map(function(pattern){
    if(pattern.length < this.led.length){
      var newPattern = [];
      for(var i=0; i < this.led.length; i++){
        newPattern[i] = pattern[i % pattern.length];
      }
      return newPattern;
    } else {
      return pattern;
    }
  }.bind(this));
};

Pattern.prototype.action = function(){
  if(!this.led){
    throw new Error("No led object assigned");
  }

  // Prepare pattern
  this.intrapolatedPatterns = this.intrapolatePatterns(this.patterns);

  var self = this;

  var perform = function(){
    console.log("LedActionPattern: PERFORM", self.name, self.id, self.run, self.count);
    var patternSequence = Promise.resolve();
    self.intrapolatedPatterns.forEach(function(pattern){
      patternSequence = patternSequence.then(function(){
        if(self.run){
          return setLeds(self.led, pattern);
        } else {
          var err = new Error("Stopping execution")
          err.err_msg = "stop_run";
          throw err;
        }
      }).then(function(){
        return wait(self.frameTime);
      });
    });

    patternSequence.then(function(){
      if(self.run){
        if(self.count !== null){
          self.count -= 1;
        }
        if(self.count === null || self.count > 0){
          self.timer = setTimeout(perform, self.interval);
        }
      }
    }).catch(function(err){
      if(err && err.err_msg === "stop_run"){
        // That's ok.
      } else {
        console.log(err.stack);
        throw err;
      }

    });

    return patternSequence;
  };

  perform();
};

// led = the FastLED object to operate on
Pattern.prototype.start = function(led){
  this.led = led;
  this.run = true;
  this.action();
  console.log("LedActionPattern: START", this.name, this.id, this.run);
};

Pattern.prototype.stop = function(){
  this.run = false;
  clearTimeout(this.timer);
  console.log("LedActionPattern: STOP", this.name, this.id, this.run);
};

module.exports = Pattern;
