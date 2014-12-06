var Thermalprinter = require('thermalprinter');
var SerialPort = require('serialport').SerialPort;
var Promise = require('promise');
var encoding = require('encoding');

var Hypher = require('hypher');
var NL = require('hyphenation.nl');

var hyphenate = function(str, len){
  var hyphenator = new Hypher(NL);

  var lines = str.split(/\n\r?/);
  var newLines = [];

  lines.forEach(function(line){
    if(line.length > len){
      var hL = hyphenator.hyphenate(line);
      var cL = "";
      hL.forEach(function(part){
        if(cL.length + part.length > len - 1){
          cL += "-";
          newLines.push(cL);
          cL = part;
        } else {
          cL += part;
        }
      });
      newLines.push(cL);
    } else {
      newLines.push(line);
    }
  });

  return newLines.join("\n");
}

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

  // - Normal font: 32 chars per line;
  // - Big font: 16 chars per line;
  // - Small font: 42 chars per line;

  printer.printMessage = function(message){

    console.log("PRINTIN!");

    var prepareText = function(txt, len){
      if(message.hyphenate){
        var ret = this.encode(hyphenate(txt, len));
        console.log("HH", ret);
        return ret
      } else {
        var ret = this.encode(txt);
        console.log("NN", ret);
        return ret;
      }
    }

    return openPrinter().then(function(printer){
      printer.lineFeed(2);

      if(message.due){
        printer.left();
        printer.small(true);

        var txtDate = "" + message.due.getDate() + "-" + (message.due.getMonth() + 1) + "-" + (message.due.getYear() + 1900);
        printer.printLine(prepareText(txtDate), 42);
      }

      printer.reset();

      printer.horizontalLine(32);

      printer.center();
      printer.big(true);
      printer.printLine(prepareText(message.name, 16));

      printer.reset();
      printer.horizontalLine(32);

      if(message.desc.length > 0){
        printer.printLine(prepareText(message.desc, 32));
        printer.horizontalLine(32);
      }

      printer.lineFeed(4);
      return printer.print(function(){

      });
    }.bind(this));
  };

  printer.encode = function(txt){
    return encoding.convert(txt, 'cp437');
  }


  printer.printer = function(){
    return openPrinter();
  };


  return printer;
};