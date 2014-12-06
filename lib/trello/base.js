var Trello = require("node-trello");
var Promise = require("promise");

module.exports = function(config){

  var trello = new Trello(config.trello.key, config.trello.token);
  trello.pGet = Promise.denodeify(trello.get);
  trello.pPut = Promise.denodeify(trello.put);

  var storeConfig = function(){
    // Store the keys. We don't care when we're done.
    // fs.writeFile(config.trelloConfigPath, JSON.stringify(config.trello, null, '  '), 'utf8');
  };

  var getListId = function(name){
    if(!(name in config.listIds)){
      throw "There is no list called '" + name +"'";
    }
    return config.listIds[name];
  };

  // Get lists an store them.
  var syncListIds = function(){
    return trello.pGet("/1/boards/" + config.trello.boardId + "/lists/open").then(function(data){
      var mapping = {
        "Messages" : "messages",
        "Queue" : "queue",
        "Done" : "done",
        "Impatience" : "impatience",
        "Immediate" : "immediate"
      };

      if(!config.listIds){
        config.listIds = {};
      }

      data.forEach(function(list){
        if(mapping[list.name]){
          config.listIds[mapping[list.name]] = list.id;
        }
      });

      storeConfig();

      return config;
    });

  };

  // Get all cards within list with internal listName.
  var getCards = function(listName){
    var fetchOptions = {
      fields : [
        "id",
        "name",
        "desc",
        "due",
        "pos",
        "labels"
      ],
      filter : "open",
      attachments : "cover",
      attachment_fields : [
        "name",
        "url"
      ]
    };

    return trello.pGet("/1/lists/" + getListId(listName) + "/cards", fetchOptions).then(function(data){
      // convert due date to real date
      data.forEach(function(card){
        if(card.due){
          card.due = new Date(card.due);
        }

        if(card.labels){
          card.labels.map(function(label){
            if(label.name.match(/^leds:/)){
              card.ledAction = label.name.replace(/^leds:/, "");
            }

            return label.name;
          })
        }

      });

      return data;
    });
  };

  // Move a card to other list
  // (position is optional)
  var moveCard = function(card, listName, position){
    if(!card && !card.id){
      throw "There is no such card to move";
    }
    if(!position){
      position = "bottom";
    }
    var args = {
      idList : getListId(listName),
      pos: position
    };
    return trello.pPut("/1/cards/" + card.id, args).then(function(newCard){
      card.idList = newCard.idList;
      card.pos = newCard.pos;
      return card;
    });
  };

  return {
    syncListIds : syncListIds,
    getCards : getCards,
    moveCard : moveCard
  };

};