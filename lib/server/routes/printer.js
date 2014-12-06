var Express = require('express');

module.exports = function(config){
  var router = Express.Router();

  router.post("/", function(req, res){
    console.log(req.body);
    var text = req.body.content;
    var action = req.body.action;
    var style = req.body.style;

    if(action === "text"){
      config.printer.printer().then(function(printer){
        printer.reset();

        printer.lineFeed(2);
        printer.horizontalLine(32);

        config.printer.printText(text, style, printer);

        printer.reset();

        printer.horizontalLine(32);
        printer.lineFeed(2);
        printer.print(function(){
          console.log("Done printing");
        });
      });
    } else {
      config.printer.printImage(__dirname + "/../../docs/test.png", "left");
    }

    res.redirect("/printer.html");
  });

  return router;
};