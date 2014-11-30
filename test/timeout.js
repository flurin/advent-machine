var Promise = require('promise');

var timer = null;
var currentAction = null;
var actionStack = [];

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
  currentAction.start();
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
    currentAction.start();
  }
}

var Action1 = function(name, interval){
  this.name = name;
  this.interval = interval;
  this.run = false;
  this.timer = null;
}

Action1.prototype.action = function(){
  var perform = function(){
    var self = this;
    var sequence = Promise.resolve();
    sequence.then(function(){
      console.log("Action1", self.name, 1);
      return wait(1000);
    }).then(function(){
      console.log("Action1", self.name, 2)
      return wait(1000);
    }).then(function(){
      console.log("Action1", self.name, 3)
      if(self.run){
        self.timer = setTimeout(boundPerform, self.interval);
      }
    });

  }

  var boundPerform = perform.bind(this);

  boundPerform();
}

Action1.prototype.start = function(){
  console.log("STARTING", this.name);
  this.run = true;
  this.action();
}

Action1.prototype.stop = function(){
  console.log("STOPPING", this.name);
  this.run = false;
  clearTimeout(this.timer);
}


pushActionStack(new Action1("one", 3000));

setTimeout(function(){
  pushActionStack(new Action1("two", 1000));
},3500);

setTimeout(function(){
  pushActionStack(new Action1("three", 500));
},4000);


setTimeout(function(){
  popActionStack();
},5000);

setTimeout(function(){
  popActionStack();
},8000);

