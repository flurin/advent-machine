# Adafruit Thermal Printer

## Some properties


- Normal font: 32 chars per line;
- Big font: 16 chars per line;
- Small font: 42 chars per line;


## Printer commands through XML

These are just some ideas of how you could tackle print formatting.

```
  <img src=''/>
  <left/>Bla <center/>Center <right/>Bla
  <big>big</big> <small>small</small>
  <b>bold</b> <u size='2'>underline</u>
  <inv>invert</inv> <flip>upside down</flip>
  <br/>
```