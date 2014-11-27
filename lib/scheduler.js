var EventEmitter = require('events').EventEmitter;

module.exports = function(config){
  var timer = null;
  var events = new EventEmitter();

  var schedule = function(){
    // Get messages
    config.messages.getPastDue().then(function(messages){
      var pushes = Promise.resolve();
      messages.each(function(message){
        pushes = pushes.then(function(){
          return config.queue.push(message);
        }).then(function(message){
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
      return scheduler;
    }
  }

  return scheduler;
}