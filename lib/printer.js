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

  printer.printMessage = function(message){
    return openPrinter().then(function(printer){
      printer.lineFeed(2);

      if(message.due){
        printer.left();
        printer.small(true);
        printer.printLine("" + message.due.getDate() + "-" + (message.due.getMonth() + 1) + "-" + (message.due.getYear() + 1900));
      }

      printer.reset();

      printer.horizontalLine(32);

      printer.center();
      printer.big(true);
      printer.printLine(message.name);

      printer.reset();
      printer.horizontalLine(32);

      if(message.desc.length > 0){
        printer.printLine(message.desc);
        printer.horizontalLine(32);
      }

      printer.lineFeed(2);
      return printer.print(function(){
        console.log("Done printing");
      });
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