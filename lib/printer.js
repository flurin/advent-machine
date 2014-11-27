var Thermalprinter = require('thermalprinter');
var SerialPort = require('serialport').SerialPort;
var Promise = require('promise');

module.exports = function(config){
  var printer = {};

  var serial = new SerialPort(config.printerConfig.port, {
    baudrate: 19200
  }, false);

  var openPrinter = function(){
    return new Promise(function(resolve, reject){
      serial.open(function(err){
        if(err){
          reject(err);
        }
        var print = new Thermalprinter(serial, config.printerConfig.printerOptions);
        print.on('ready', function() {
          print.reset();
          print.print(function(){
            resolve(print);
          });
        });
      })

    });
  }

  var print = function(printer){
    return new Promise(function(resolve, reject){
      printer.print(function(){
        resolve(printer);
      })
    });
  }

  printer.printer = function(){
    return openPrinter();
  }

  printer.printImage = function(path, position){
    console.log(path);
    return openPrinter().then(function(printer){
      return new Promise(function(resolve, reject){
        printer.printImage(path, position, function(){
          resolve(printer);
        });
      });
    }).then(function(printer){
      return print(printer);
    })
  };

  printer.printText = function(text){
    return openPrinter().then(function(printer){
      printer.printLine(text);
      printer.lineFeed(2);
      return print(printer);
    });
  }

  return printer;
}