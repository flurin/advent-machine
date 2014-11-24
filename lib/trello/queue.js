module.exports = function(config){

  var trello = require("./base")(config);

  return {
    push : function(message){
      return trello.syncListIds().then(function(){
        return trello.moveCard(message, "queue")
      })
    },
    unshift : function(){
      return trello.syncListIds().then(function(){
        return trello.getCards("queue");
      }).then(function(cards){
        if(cards.length > 0){
          return trello.moveCard(cards[0], "done");
        }
      }).catch(function(err){
        console.error(err);
      });
    }
  }

}