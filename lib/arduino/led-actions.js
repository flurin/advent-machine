var Promise = require('promise');

var timer = null;
var currentAction = null;
var actionStack = [];
var led = null;

var wait = function(milis){
  return new Promise(function(resolve, reject){
    return setTimeout(resolve, milis);
  });
}

var pushActionStack = function(action){
  if(currentAction){
    // Stop current action
    currentAction.stop();

    // Push the current action onto the stack for later
    actionStack.push(currentAction);
  }

  // Start new action
  currentAction = action;
  currentAction.start(led);
};

// Pop action off stack and perform previous action
var popActionStack = function(){
  if(currentAction){
    currentAction.stop();
  }

  // Remove last part from stack
  var action = actionStack.pop();
  if(action){
    currentAction = action;
    currentAction.start(led);
  }
}

module.exports = {
  setLed : function(l){
    led = l;
  },
  push : pushActionStack,
  pop : popActionStack
}