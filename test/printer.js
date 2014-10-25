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

Printer.prototype.underline = function(dots){
  var commands = [27, 45, dots]
  return this.writeCommands(commands);
};

Printer.prototype.userChar = function(on){
  var commands = [27, 37, (on == true ? 1 : 0)]
  return this.writeCommands(commands);
};

Printer.prototype.fontB = function(on){
  var commands = [27, 33, (on == true ? 1 : 0)]
  return this.writeCommands(commands);  
}

Printer.prototype.upsideDown = function(on){
  var commands = [27, 123, (on == true ? 1 : 0)]
  return this.writeCommands(commands);  
}


// Set barcodeTextPosition
//
// Position can be:
// 0: Not printed
// 1: Above the barcode
// 2: Below the barcode
// 3: Both above and below the barcode
Printer.prototype.barcodeTextPosition = function(pos){
  if(pos > 3 || pos < 0){
    return this;
  }

  var commands = [29, 72, pos];
  return this.writeCommands(commands);
}

// Set barcode height
// 0 < h < 255 (default = 50)
Printer.prototype.barcodeHeight = function(h){
  if(h > 255 || h < 0){
    return this;
  }

  var commands = [29, 104, h];
  return this.writeCommands(commands);
}


Printer.BARCODE_CHARSETS = {
  NUMS: function(n){ return n >= 48 && n <= 57 },
  ASCII: function(n){ return n >= 0 && n <= 127 }
}

Printer.BARCODE_TYPES = {
  UPCA : {
    code: 65,
    size: function(n){ return n == 11 || n == 12; },
    chars: Printer.BARCODE_CHARSETS.NUMS
  },
  UPCE : {
    code: 66,
    size: function(n){ return n == 11 || n == 12; },
    chars: Printer.BARCODE_CHARSETS.NUMS
  },
  EAN13 : {
    code: 67,
    size: function(n){ return n == 12 || n == 13; },
    chars: Printer.BARCODE_CHARSETS.NUMS
  },
  EAN8 : {
    code: 68,
    size: function(n){ return n == 7 || n == 8; },
    chars: Printer.BARCODE_CHARSETS.NUMS
  },
  CODE39 : {
    code: 69,
    size: function(n){ return n > 1; },
    chars: function(n){ 
      // " $%+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      return (
        n == 32 ||
        n == 36 ||
        n == 37 ||
        n == 43 ||
        (n >= 45 && n <= 57) ||
        (n >= 65 && n <= 90)
      )
     } 
  },
  I25 : {
    code: 70,
    size: function(n){ return n > 1 && n % 2 == 0; },
    chars: Printer.BARCODE_CHARSETS.NUMS
  },
  CODEBAR : {
    code: 71,
    size: function(n){ return n > 1; },
    chars: function(n){ 
      return (
        n == 36 ||
        n == 43 ||
        (n >= 45 && n <= 58) ||
        (n >= 65 && n <= 68)
      )
     } 
  },
  CODE93 : {
    code: 72,
    size: function(n){ return n > 1; },
    chars: Printer.BARCODE_CHARSETS.ASCII
  },
  CODE128 : {
    code: 73,
    size: function(n){ return n > 1; },
    chars: Printer.BARCODE_CHARSETS.ASCII
  },
  CODE11 : {
    code: 74,
    size: function(n){ return n > 1; },
    chars: Printer.BARCODE_CHARSETS.NUMS
  },
  MSI : {
    code: 75,
    size: function(n){ return n > 1; },
    chars: Printer.BARCODE_CHARSETS.NUMS
  }
}

Printer.prototype.barcode = function(type, data){
  var commands = [29, 107];
  commands.push(type.code);
  commands.push(data.length);

  // Validate size
  if(!type.size(data.length)){
    return this;
  };

  for(var i=0; i < data.length; i++){
    var code = data.charCodeAt(i);  
    if(!type.chars(code)){
      return this;
    }

    commands.push(code);
  }

  return this.writeCommands(commands);
}

serial.on('open',function() {
  var p = new Printer(serial, printerOpts);

  p.on('ready', function() {
    p.reset();

    p.barcodeTextPosition(2);

    p.barcodeHeight(20);

    // p.barcode(Printer.BARCODE_TYPES.CODE39, "55HENK");

    // p.barcode(Printer.BARCODE_TYPES.CODE128, "Test123!");

    // p.barcode(Printer.BARCODE_TYPES.EAN13, "Test123!");

    // p.barcode(Printer.BARCODE_TYPES.EAN13, "0123456789012");

    // p.horizontalLine(32)

    // p.center();

    // p.fontB(true);
    // p.upsideDown(true);

    // p.printLine("Hello Flurin");

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