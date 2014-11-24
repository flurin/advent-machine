var SerialPort = require('serialport').SerialPort;
var Printer = require('thermalprinter');

var serial = new SerialPort('/dev/ttyAMA0', {
  baudrate: 19200
});


var printerOpts = {
  maxPrintingDots : 7,
  heatingTime : 150,
  heatingInterval : 2,
  commandDelay: 0
};


serial.on('open',function() {
  var p = new Printer(serial, printerOpts);

  p.on('ready', function() {
    p.reset();

    // p.barcodeTextPosition(2);

    // p.barcodeHeight(20);

    // p.barcode(Printer.BARCODE_TYPES.CODE39, "55HENK");

    // p.barcode(Printer.BARCODE_TYPES.CODE128, "Test123!");

    // p.barcode(Printer.BARCODE_TYPES.EAN13, "Test123!");

    // p.barcode(Printer.BARCODE_TYPES.EAN13, "0123456789012");

    // p.horizontalLine(32)

    p.center();

    // p.fontB(true);
    // p.upsideDown(true);

    p.printLine("Hello Flurin");

    // p.fontB(false);

    // p.printLine("Hello Flurin");

    // p.big(true)

    // p.printLine("Hello Flurin");

    // p.underline(2);

    // p.printLine("Hello Flurin");

    // p.horizontalLine(32);

    // p.big(true);

    // p.printLine("Hello Flurin");

    // p.big(false);
    // p.bold(true);

    // p.printLine("Hello Flurin");

    // p.reset();

    p.lineFeed(2);

    p.print(function(){
      console.log("done");
      process.exit();
    });

  });
});