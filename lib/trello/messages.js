module.exports = function(config){

  var trello = require("./base")(config);

  return {
    getPastDueDate : function(){
      return trello.syncListIds().then(function(){
        return trello.getCards("messages");
      }).then(function(messages){
        return messages.filter(function(message){
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