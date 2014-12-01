var Express = require('express');
var fs = require("fs");

module.exports = function(config){
  var router = Express.Router();

  var OAuth = require('oauth').OAuth;

  var oauth_secrets = {};

  var getOAuthObject = function(req){
    var callbackUrl = req.protocol + "://" + req.hostname + ":" + config.port + req.baseUrl + "/callback";
    return new OAuth(
      "https://trello.com/1/OAuthGetRequestToken",
      "https://trello.com/1/OAuthGetAccessToken",
      config.trello.key,
      config.trello.secret,
      "1.0",
      callbackUrl,
      "HMAC-SHA1")
  }

  router.get("/", function(req, res){
    var oauth = getOAuthObject(req);
    oauth.getOAuthRequestToken(
      function(error, token, tokenSecret, result){
        oauth_secrets[token] = tokenSecret;
        res.redirect(302, "https://trello.com/1/OAuthAuthorizeToken?oauth_token=" + token + "&name=" + config.trello.appName + "&scope=read,write&expiration=never");
      }
    );
  });

  router.get("/callback", function(req, res){
    console.log(req.query);

    var oauth = getOAuthObject(req);

    var token = req.query.oauth_token
    var tokenSecret = oauth_secrets[token]
    var verifier = req.query.oauth_verifier

    oauth.getOAuthAccessToken(token, tokenSecret, verifier, function(error, accessToken, accessTokenSecret, results){
      if(error){
        console.log(error);
        return res.status(500).json(error).end();
      }

      config.trello.token = accessToken;
      config.trello.tokenSecret = accessTokenSecret;

      fs.writeFile(config.trelloConfigPath, JSON.stringify(config.trello, null, '  '), 'utf8', function(){
        return res.json({"data" : "Saved!"});
      })

    });
  });

  return router;
};