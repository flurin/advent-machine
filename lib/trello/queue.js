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
            console.error(err);
          });
        } else {
          throw new Error("no_messages");
        }
      })
    }
  }

}