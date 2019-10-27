var express = require("express");
var app = express();

var port = 30662;
app.use(express.static("JavaScriptSPA"));
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(port);
console.log("Listening on port " + port + "...");

var msalConfig = {
  auth: {
    clientId: "12af7ab6-f961-4da7-8c05-d61a6168bd15",
    authority:
      "https://login.microsoftonline.com/79fe009c-79e0-4bc9-baec-a76d3145bde5"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};
var FHIRConfig = {
  FHIRendpoint: "https://angelsharedemo4.azurehealthcareapis.com/metadata"
};
var requestObj = {
  scopes: ["https://azurehealthcareapis.com/user_impersonation"]
};

var myMSALObj = new Msal.UserAgentApplication(msalConfig);
myMSALObj.handleRedirectCallback(authRedirectCallBack);

function authRedirectCallBack(error, response) {
  if (error) {
    console.log(error);
  } else if (response.tokenType === "access_token") {
    callFHIRServer(
      FHIRConfig.FHIRendpoint + "/Patient",
      "GET",
      null,
      response.accessToken,
      FHIRCallback
    );
  } else {
    console.log("token type is:" + response.tokenType);
  }
}
function signIn() {
  myMSALObj
    .loginPopup(requestObj)
    .then(function(loginResponse) {
      showWelcomeMessage();
      acquireTokenPopupAndCallFHIRServer();
    })
    .catch(function(error) {
      console.log(error);
    });
}

function showWelcomeMessage() {
  var divWelcome = document.getElementById("WelcomeMessage");
  divWelcome.innerHTML =
    "Welcome " +
    myMSALObj.getAccount().userName +
    " to FHIR Patient Browsing App";
  var loginbutton = document.getElementById("SignIn");
  loginbutton.innerHTML = "Sign Out";
  loginbutton.setAttribute("onclick", "signOut()");
}

function signOut() {
  myMSALObj.logout();
}

function acquireTokenPopupAndCallFHIRServer() {
  myMSALObj
    .acquireTokenSilent(requestObj)
    .then(function(tokenResponse) {
      callFHIRServer(
        FHIRConfig.FHIRendpoint + "/Patient",
        "GET",
        null,
        tokenResponse.accessToken,
        FHIRCallback
      );
    })
    .catch(function(error) {
      console.log(error);
      if (requiresInteraction(error.errorCode)) {
        myMSALObj
          .acquireTokenPopup(requestObj)
          .then(function(tokenResponse) {
            callFHIRServer(
              FHIRConfig.FHIRendpoint + "/Patient",
              "GET",
              null,
              tokenResponse.accessToken,
              FHIRCallback
            );
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    });
}
function callFHIRServer(theUrl, method, message, accessToken, callBack) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200)
      callBack(JSON.parse(this.responseText));
  };
  xmlHttp.open(method, theUrl, true);
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.setRequestHeader("Authorization", "Bearer " + accessToken);
  xmlHttp.send(message);
}

function FHIRCallback(data) {
  document.getElementById("json").innerHTML = JSON.stringify(data, null, 2);
}
