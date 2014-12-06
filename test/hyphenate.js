var Hypher = require('hypher');
var NL = require('hyphenation.nl');
var linewrap = require('linewrap');

var L = 20;
var s = "Dit is een liefdesbrief aan de liefste Lieke\n\nGroetjes, Le Flegmeister";

var hyphenator = new Hypher(NL);
var wrapper = linewrap(L);

var lines = s.split(/\n\r?/);
var newLines = [];

lines.forEach(function(line){
  if(line.length > L){
    var hL = hyphenator.hyphenate(line);
    var cL = "";
    hL.forEach(function(part){
      if(cL.length + part.length > L - 1){
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

console.log(newLines.join("\n"));