var Thermalprinter = require('thermalprinter');
var SerialPort = require('serialport').SerialPort;
var Promise = require('promise');
var encoding = require('encoding');

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
      });

    });
  };

  var print = function(printer){
    return new Promise(function(resolve, reject){
      printer.print(function(){
        resolve(printer);
      });
    });
  };

  printer.printMessage = function(message){
    return openPrinter().then(function(printer){
      printer.lineFeed(2);

      if(message.due){
        printer.left();

        var date = "" + message.due.getDate() + "-" + (message.due.getMonth() + 1) + "-" + (message.due.getYear() + 1900);
        this.printText(date, "small", printer);
      }

      printer.reset();

      printer.horizontalLine(32);

      printer.center();
      this.printText(message.name, "big", printer);

      printer.reset();
      printer.horizontalLine(32);

      if(message.desc.length > 0){
        this.printText(message.desc, "normal", printer);
        printer.horizontalLine(32);
      }

      printer.lineFeed(4);
      return printer.print(function(){

      });
    }.bind(this));
  };

  // - Normal font: 32 chars per line;
  // - Big font: 16 chars per line;
  // - Small font: 42 chars per line;
  printer.printText = function(msg, size, printer){
    var str = encoding.convert(msg, '850');

    // set codepage to 850
    printer.writeCommands([27, 116, 1]);

    if(size === "big"){
      printer.big(true);
    } else if (size === "small"){
      printer.small(true);
    }

    printer.printLine(str);

    printer.reset();
  };

  printer.printer = function(){
    return openPrinter();
  };


  return printer;
};