var Promise = require('promise');

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

var fadeAt = function(bCol, eCol, currentTime, totalTime){
  return bCol.clone().mix(eCol, 1 - currentTime / totalTime);  
}

module.exports = {
  fromTo : fadeFromTo,
  at : fadeAt
}