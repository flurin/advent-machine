// Config
var config = {
  trelloConfigPath : __dirname + "/trello-conf.json",
  publicPath : __dirname + '/public',
  port: 3000,
  scheduleInterval : 5000,
  messages : null,
  queue : null
}

config.trello = require(config.trelloConfigPath);

config.messages = require("./lib/trello/messages")(config);
config.queue = require("./lib/trello/queue")(config);

// Server
var Server = require("./lib/server")(config);

// var Scheduler = require("./lib/scheduler")(config);

// Start Server
// Server.start();

var trello = require("./lib/trello/base")(config);


config.messages.getPastDueDate().then(function(messages){
  // console.log(messages);
  if(messages[0]){
    return trello.moveCard(messages[0], "queue");
  }
}).then(function(data){
  console.log(data);
}).then(function(){
  return config.queue.unshift()
}).then(function(message){
  console.log(message);
}).catch(function(err){
  console.log("ERROR", err);
})

