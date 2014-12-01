var Express = require('express');
var fs = require("fs");

var patterns = require('../../arduino/patterns');
var actions = require('../../arduino/led-actions');

module.exports = function(config){
  var router = Express.Router();

  router.get("/", function(req, res){
    var data = {
      req : req,
      currentAction : actions.currentAction,
      actions : actions.stack,
      patterns : Object.keys(patterns)
    }
    res.render("leds/index", data);
  })

  router.post("/", function(req, res){

    if(req.body.perform == "pop"){
      actions.pop();
    } else {
      var action = patterns[req.body.pattern];

      if(action){
        actions.push(action({
          frameTime : parseInt(req.body.frametime),
          interval : parseInt(req.body.interval)
        }));
      }

    }

    res.redirect(req.baseUrl + "/");
  });

  return router;
}