var Express = require('express');
var extend = require('extend');
var bodyParser = require('body-parser');

module.exports = function(config){

  var defaultConfig = {
    publicPath: ".",
    port: 3000
  };

  // Hack to copy defaultconfig values into config (updates config!!)
  for (key in Object.keys(defaultConfig)){
    if(!(key in config)){
      config[key] = defaultConfig[key];
    }
  }

  // Setup Express app
  var app = Express();

  app.use(Express.static(config.publicPath));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var trelloAuthRouter = require("./server/trello_oauth")(config);
  app.use("/oauth", trelloAuthRouter);


  return {
    app : app,
    start : function(){
      var server = app.listen(config.port, function(){
        var host = server.address().address;
        var port = server.address().port;

        console.log('Started webserver at http://%s:%s', host, port)
      });
    }
  }
}

