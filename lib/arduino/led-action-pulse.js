// colors = Color
// colors = [Color1, Color2] -> Intrapolate over all leds. So for 3 leds you get c1,c2,c1
// fadeTime = time from (black -> color -> black)
// intervalTime = starttime between 2 fades
// decay = slow down factor: intervalTime = intervalTime * decay; decay = 1 == no decay
var pulseLeds = function(colors, fadeTime, intervalTime, decay){
  if(!started){ throw new Error("The board has not yet started"); }


}