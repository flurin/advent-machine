var Promise = require("promise");

var commands = {
  FASTLED_DATA: 0x74,
  FASTLED_SET: 0x01,
  FASTLED_SHOW: 0x02,

  START_SYSEX: 0xF0,
  END_SYSEX: 0xF7
}


var FastLed = function(io, length){
  this.io = io;
  this.length = length;
  this.values = [];
}

FastLed.prototype.write = function(data){
  var port = this.io.sp;
  return Promise.new(function(resolve, reject){
    port.write(new Buffer(data), function(){
      port.drain(function(){
        resolve();
      })
    });
  }.bind(this))
}

FastLed.prototype.setColor = function(pixelNum, color){
  return this.set(pixelNum, color.red(), color.green(), color.blue());
}

// Sets all leds to 0,0,0 and show
FastLed.prototype.reset = function(){
  for(var i = 0; i < this.length; i++){
    this.set(i, 0,0,0);
  }
  return this.show();
}

FastLed.prototype.set = function(pixelNum, r, g, b){
  this.values[pixelNum] = [r,g,b];

  // Even though r,g,b is only 8 bit, we need to split it as
  // the SYSEX protocol only supports 7 bit.
  var data = [
    commands.START_SYSEX,
    commands.FASTLED_DATA,
    commands.FASTLED_SET,
    pixelNum & 0x7F,
    (pixelNum >> 7) & 0x7F,
    r & 0x7F,
    (r >> 7) & 0x7F,
    g & 0x7F,
    (g >> 7) & 0x7F,
    b & 0x7F,
    (b >> 7) & 0x7F,
    commands.END_SYSEX
  ]

  return this.write(data);
}

FastLed.prototype.show = function(){
  var data = [
    commands.START_SYSEX,
    commands.FASTLED_DATA,
    commands.FASTLED_SHOW,
    commands.END_SYSEX
  ]
  return this.write(data);
}

module.exports = FastLed;