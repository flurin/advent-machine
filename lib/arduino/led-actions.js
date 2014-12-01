var logger = require("../logger");

var currentAction = null;
var actionStack = [];
var led = null;

var pushActionStack = function(action){
  logger.debug("LedActionstack:", "Starting", action.name, "Stack:", actionStack.map(function(a){ return a.name; }));
  logger.debug("LedActionstack:", "Current action is", currentAction && currentAction.name);

  if(currentAction){
    // Stop current action
    currentAction.stop();

    // Push the current action onto the stack for later
    actionStack.push(currentAction);

    // No currentAction.
    currentAction = null;
  }

  // Start new action
  currentAction = action;
  logger.debug("LedActionstack:", "New current action is", currentAction.name);
  currentAction.start(led);
};

// Pop action off stack and perform previous action
var popActionStack = function(){
  logger.debug("LedActionstack:", "Stopping", "Stack:", actionStack.map(function(a){ return a.name; }));
  logger.debug("LedActionstack:", "Current action is", currentAction && currentAction.name);

  if(currentAction){
    currentAction.stop();
    currentAction = null;
  }

  // Remove last part from stack
  var action = actionStack.pop();
  if(action){
    currentAction = action;
    logger.debug("LedActionstack:", "New current action is", currentAction.name);
    currentAction.start(led);
  }
};

module.exports = {
  setLed : function(l){
    led = l;
  },
  currentAction : currentAction,
  stack : actionStack,
  push : pushActionStack,
  pop : popActionStack
};