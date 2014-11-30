var Promise = require('promise');

module.exports = function(milis){
  return new Promise(function(resolve, reject){
    return setTimeout(resolve, milis);
  });
}