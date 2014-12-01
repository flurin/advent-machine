var Express = require('express');
var Promise = require('promise');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');

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

  app.set("view engine", "ejs");
  app.set("views", __dirname + "/server/views");
  app.set('layout', 'layouts/default'); // defaults to 'layout'


  app.use(Express.static(config.publicPath));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(expressLayouts);
  var trelloAuthRouter = require("./server/routes/trello_oauth")(config);
  var printerRouter = require("./server/routes/printer")(config);

  app.use("/oauth", trelloAuthRouter);
  app.use("/printer", printerRouter);


  return {
    app : app,
    start : function(){
      return new Promise(function(resolve, reject){
        var server = app.listen(config.port, function(){
          var host = server.address().address;
          var port = server.address().port;
          console.log('Started webserver at http://%s:%s', host, port)
          return resolve(server);
        });

      })
    }
  }
}

