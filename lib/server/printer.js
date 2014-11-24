var Express = require('express');
var fs = require("fs");

module.exports = function(config){
  var router = Express.Router();

  router.post("/", function(req, res){
    console.log(req.body);
    var text = req.body.content;
    var action = req.body.action;

    if(action == "text"){
      config.printer.printText(text);
    } else {
      config.printer.printImage(__dirname + "/../../docs/test.png", "left");
    }

    res.redirect("/printer.html")
  });

  return router;
}