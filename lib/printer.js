var Thermalprinter = require('thermalprinter');
var SerialPort = require('serialport').SerialPort;
var Promise = require('promise');

module.exports = function(config){
  var printer = {};

  var serial = new SerialPort(config.printerConfig.port, {
    baudrate: 19200
  }, false);


  printer.printText = function(text){
    return new Promise(function(resolve, reject){
      serial.open(function(err){
        if(err){
          reject(err);
        }
        var print = new Thermalprinter(serial, config.printerConfig.printerOptions);
        print.on('ready', function() {
          print.reset();
          print.printLine(text);
          print.lineFeed(2);
          print.print(function(){
            resolve();
          });
        });
      })

    })
  }

  return printer;
}