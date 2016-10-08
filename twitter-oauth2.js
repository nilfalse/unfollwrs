// https://codepad.co/snippet/uVO5YJuE

//Install this module to send easily your requests
var request=require('request');

//DEFINE YOUR TWITTER APP KEYS HERE
var twitter_ConsKey;
var twitter_SecretKey;
//MUST BE USED IN ANY REQUEST HEADER TO TWITTER API
var bearerToken=null;

var _getBearerCredentialToken = function(){
  return new Buffer(twitter_ConsKey+ ':' + twitter_SecretKey).toString('base64');
};

var _getBearer= function(cb){
    
  if(bearerToken===null){
    var bearerCreds= _getBearerCredentialToken();

    //Prepare Bearer token request
    var oauthOptions = {
      'url': 'https://api.twitter.com/oauth2/token',
      'method': 'POST',
      'headers':{
        'Authorization': 'Basic '+ bearerCreds,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      'body': 'grant_type=client_credentials'
    };

    //Send POST request for Oauth2
    request.post(oauthOptions, function(err, res, body) {
      if(err) cb(err);
      else{
        var bodyjson = JSON.parse(body);
        bearer = bodyjson.access_token;
        console.log("TWITTER API: OAUTH2");
        console.log("request: "+JSON.stringify(oauthOptions));
        console.log("response: "+ JSON.stringify(res));
        console.log("Bearer token: "+ bearer);
        console.log();
        bearerToken = bearer;
        cb(null);
      }

    });
  }
  else{
    cb(null);
  }
}

_getBearer(() => {});

