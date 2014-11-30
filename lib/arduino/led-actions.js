var currentAction = null;
var actionStack = [];
var led = null;

var pushActionStack = function(action){
  console.log("Starting", action.name, "Stack:", actionStack.map(function(a){ return a.name; }));
  console.log("Current action is", currentAction && currentAction.name);

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
  console.log("New current action is", currentAction.name);
  currentAction.start(led);
};

// Pop action off stack and perform previous action
var popActionStack = function(){
  console.log("Stopping", "Stack:", actionStack.map(function(a){ return a.name; }));
  console.log("Current action is", currentAction && currentAction.name);

  if(currentAction){
    currentAction.stop();
    currentAction = null;
  }

  // Remove last part from stack
  var action = actionStack.pop();
  if(action){
    currentAction = action;
    console.log("New current action is", currentAction.name);
    currentAction.start(led);
  }
};

module.exports = {
  setLed : function(l){
    led = l;
  },
  push : pushActionStack,
  pop : popActionStack
};