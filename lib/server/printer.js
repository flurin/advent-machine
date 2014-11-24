var Express = require('express');
var fs = require("fs");

module.exports = function(config){
  var router = Express.Router();

  router.post("/", function(req, res){
    console.log(req.body);
    var text = req.body.content;
    config.printer.printText(text);
    res.redirect("/printer.html")
  });

  return router;
}