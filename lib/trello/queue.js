var logger = require("../logger");

module.exports = function(config){

  var trello = require("./base")(config);

  return {
    // Immideately move the message to done
    done : function(message){
      return trello.syncListIds().then(function(){
        return trello.moveCard(message, "done")
      })
    },
    // Push message onto the queue
    push : function(message){
      return trello.syncListIds().then(function(){
        return trello.moveCard(message, "queue")
      })
    },
    // Get the top message of the queue and move it to done.
    unshift : function(){
      return trello.syncListIds().then(function(){
        return trello.getCards("queue");
      }).then(function(cards){
        if(cards.length > 0){
          return trello.moveCard(cards[0], "done").catch(function(err){
            logger.error(err.stack);
          });
        } else {
          var err = new Error("No messages in queue");
          err.code = "no_messages";
          throw err;
        }
      })
    }
  }

}