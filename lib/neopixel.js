var neopixel = {
  NEOPIXEL: 0x09,

  NEOPIXEL_DATA: 0x73,
  NEOPIXEL_CONFIG: 0x00,
  NEOPIXEL_SET: 0x01,
  NEOPIXEL_SHOW: 0x02,
  NEOPIXEL_SET_N: 0x03
}

var START_SYSEX = 0xF0,
    END_SYSEX = 0xF7;

var NeoPixel = function(io, pin){
  this.io = io;
  this.pin = pin;
  this.io.pinMode(pin, neopixel.NEOPIXEL);
}

// Config constants
NeoPixel.TYPE = {
  NEO_RGB: 0x00,
  NEO_GRB: 0x01,
  NEO_BRG: 0x04,

  NEO_KHZ800: 0x02,
  NEO_KHZ400: 0x00
};

NeoPixel.prototype.config = function(pixelCount, pixelType){
  this.pixelCount = pixelCount;
  this.pixelType = pixelType

  var data = [
    START_SYSEX,
    neopixel.NEOPIXEL_DATA,
    neopixel.NEOPIXEL_CONFIG,
    this.pin,
    this.pixelCount & 0x7F,
    (this.pixelCount >> 7) & 0x7F,
    this.pixelType,
    END_SYSEX
  ]
  this.write(data);
}

NeoPixel.prototype.write = function(data){
  this.io.sp.write(new Buffer(data));
}

// colors = [[n, r, g, b],[n, r, g, b]]
NeoPixel.prototype.setN = function(colors){
  var data = [
    START_SYSEX,
    neopixel.NEOPIXEL_DATA,
    neopixel.NEOPIXEL_SET_N,
    this.pin,
  ]

  // Number of pixels we're setting
  data.push(colors.length & 0x7F);
  data.push((colors.length >> 7) & 0x7F);

  var px;
  for(var i=0; i < colors.length; i++){
    px = colors[i];

    data.push(px[0] & 0x7F);
    data.push((px[0] >> 7) & 0x7F);

    data.push(px[1]);
    data.push(px[2]);
    data.push(px[3]);
  }

  data.push(END_SYSEX);
  this.write(data)
}

NeoPixel.prototype.set = function(pixelNum, r, g, b){

  // Even though r,g,b is only 8 bit, we need to split it as 
  // the SYSEX protocol only supports 7 bit.
  var data = [
    START_SYSEX,
    neopixel.NEOPIXEL_DATA,
    neopixel.NEOPIXEL_SET,
    this.pin,
    pixelNum & 0x7F,
    (pixelNum >> 7) & 0x7F,
    r & 0x7F,
    (r >> 7) & 0x7F,
    g & 0x7F,
    (g >> 7) & 0x7F,
    b & 0x7F,
    (b >> 7) & 0x7F,
    END_SYSEX
  ] 

  console.log(data) ;
  this.write(data);
}

NeoPixel.prototype.show = function(){
  var data = [
    START_SYSEX,
    neopixel.NEOPIXEL_DATA,
    neopixel.NEOPIXEL_SHOW,
    this.pin,
    END_SYSEX
  ]   
  this.write(data);
}

module.exports = NeoPixel;