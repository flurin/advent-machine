module.exports = function(config){

  var trello = require("./base")(config);

  return {
    getImmideate : function(){
      return trello.syncListIds().then(function(){
        return trello.getCards("immediate");
      });
    },
    getRandomImpatience : function(){
      return trello.syncListIds().then(function(){
        return trello.getCards("impatience");
      }).then(function(messages){
        return messages[Math.floor(Math.random() * messages.length)];
      });
    },
    getPastDueDate : function(){
      return trello.syncListIds().then(function(){
        return trello.getCards("messages");
      }).then(function(messages){
        return messages.filter(function(message){
          console.log(message.due, new Date(0));
          // Filter only dates that have a due date and the due date has past
          return message.due !== null && message.due < new Date();
        }).sort(function(a, b){
          // Sort by due date oldest first
          return a.due - b.due
        });
      });
    }
  }

}