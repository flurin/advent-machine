var logger = require("./logger");
var Promise = require('promise');
var EventEmitter = require('events').EventEmitter;

module.exports = function(config){
  var timer = null;
  var events = new EventEmitter();

  var schedule = function(){
    logger.debug("Scheduler:", "Schedule");
    // Get messages
    return Promise.all([
      config.messages.getPastDueDate(),
      config.messages.getImmediate()
    ]).catch(function(err){
      logger.error("Scheduler:", "Could not get messages\n", err.stack);
      throw err;
    }).then(function(results){
      var messages = results[0];
      var immediateMessages = results[1];

      // Will just emit event.
      var done = Promise.resolve();
      if(immediateMessages && immediateMessages.length > 0){
        immediateMessages.forEach(function(message){
          done = done.then(function(){
            return config.queue.done(message);
          }).then(function(message){
            events.emit("immediate", message);
          });
        });
      }

      // Handle messages
      var pushes = Promise.resolve();
      if(messages && messages.length > 0){
        messages.forEach(function(message){
          pushes = pushes.then(function(){
            logger.debug("Scheduler:", "Pushing message into queue!");
            return config.queue.push(message);
          }).then(function(message){
            logger.debug("Scheduler:", "Emit schedule event!");
            events.emit("schedule", message);
          });
        });
      }

      return Promise.all([pushes, done]);
    }).then(function(){
      // Next iteration
      timer = setTimeout(schedule, config.scheduleInterval);
    });
  };

  var scheduler = {
    on : function(){
      return events.on.apply(events, arguments);
    },
    stop : function(){
      clearTimeout(timer);
    },
    start : function(){
      // Let's get started;
      timer = setTimeout(schedule, config.scheduleInterval);
      return new Promise(function(resolve, reject){
        resolve(scheduler);
      });
    }
  };

  return scheduler;
};