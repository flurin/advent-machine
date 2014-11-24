var Thermalprinter = require('thermalprinter');
var SerialPort = require('serialport').SerialPort;

module.exports = function(config){
  var printer = {};
  var serial = new SerialPort(config.printerConfig.port, {
    baudrate: 19200
  }, false);


  printer.printText = function(text){
    serial.open(function(){
      var print = new Thermalprinter(serial, config.printerConfig.printerOptions);
      print.on('ready', function() {
        console.log("Printer ready");
        print.reset();
        console.log("Printer reset");
        print.printLine(text);
        console.log("Printed:", text);
        print.lineFeed(2);
      });
    })
  }

  return printer;
}