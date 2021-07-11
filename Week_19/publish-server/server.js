let http = require("http");
let fs = require("fs");
let unzipper = require("unzipper");
const querystring = require("querystring");
const https = require("https");

// 2. auth route: to recieve code, and use code, client_id, client_secret to get token

function auth(request, response) {
  let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  getToken(query.code, function (info) {
    console.log(info);
    response.write(`<a href='http://localhost:8082/?token=${info.access_token}'></a>`);
    response.end();
  });
}

function getToken(code, callback) {
  let request = https.request(
    {
      hostname: "github.com",
      path: `/login/oauth/access_token?code=${code}&client_id=Iv1.1575d21fbd941970&client_secret=16f02d2f7418a531bbe88b5389531888c3a95c65`,
      port: 443,
      method: "POST",
    },
    function (response) {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk.toString();
      });
      response.on("end", (chunk) => {
        callback(querystring.parse(body));
      });
    }
  );
  request.end(); // 将请求发出
}

// 4. Publish route: use token to get user information and check permission, and start to publish
function publish(request, response) {
  let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);

  getUser(query.token, info => {
      if(info.login === "PH-C") {
          request.pipe(unzipper.Extract({ path: "../server/public/"}));
          request.on("end", function() {
              response.end("success!");
          });
      }
  });
}

function getUser(token, callback) {
  let request = https.request({
      hostname: "api.github.com",
      path: `/user`,
      port: 443,
      method: "GET",
      headers: {
          Authorization: `token ${token}`,
          "User-Agent": "toy-publish-ph"
      }
  }, function(response) {
      let body = "";
      response.on("data", chunk => {
          body += chunk.toString();
      });
      response.on("end", chunk => {
          console.log(body);
          callback(JSON.parse(body));
      });
  });
  request.end();
}

http.createServer(function(request, respose) {
  if(request.url.match(/^\/auth\?/)) {
      return auth(request, respose);
  }
  if(request.url.match(/^\/publish\?/)) {
      return publish(request, respose);
  }
  console.log("request");
  
}).listen(8082);
