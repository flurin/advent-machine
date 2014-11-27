var Promise = require('promise');
var EventEmitter = require('events').EventEmitter;

module.exports = function(config){
  var timer = null;
  var events = new EventEmitter();

  var debug = function(){
    console.log.apply(console, arguments);
  }

  var schedule = function(){
    debug("Schedule!");
    // Get messages
    config.messages.getPastDueDate().catch(function(err){
      console.log("Could not get messages", err);
    }).then(function(messages){
      var pushes = Promise.resolve();
      messages.forEach(function(message){
        pushes = pushes.then(function(){
          debug("Pushing into queue!");
          return config.queue.push(message);
        }).then(function(message){
          debug("Emit event!");
          events.emit("schedule", message);
        });
      });
      return pushes;
    }).then(function(){
      // Next iteration
      timer = setInterval(schedule, config.scheduleInterval);
    });
  };

  var scheduler = {
    on : function(){
      return events.on.apply(events, arguments);
    },
    stop : function(){
      clearInterval(timer);
    },
    start : function(){
      // Let's get started;
      timer = setInterval(schedule, config.scheduleInterval);
      return new Promise(function(resolve, reject){
        resolve(scheduler);
      });
    }
  }

  return scheduler;
}