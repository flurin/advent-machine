var Express = require('express');
var fs = require("fs");

module.exports = function(config){
  var router = Express.Router();

  router.post("/", function(req, res){
    console.log(req.body);
    var text = req.body.content;
    var action = req.body.action;
    var style = req.body.style;

    if(action == "text"){
      config.printer.printer().then(function(printer){
        if(style == "big"){
          printer.big(true);
        } else if(style == "small"){
          printer.small(true);
        }
        printer.lineFeed(2);
        printer.horizontalLine(32);
        printer.printLine(text);
        printer.horizontalLine(32);
        printer.lineFeed(2);
        printer.print(function(){
          console.log("Done printing");
        });
      });
    } else {
      config.printer.printImage(__dirname + "/../../docs/test.png", "left");
    }

    res.redirect("/printer.html")
  });

  return router;
}