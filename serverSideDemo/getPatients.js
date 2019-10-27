const rp = require("request-promise");

// Gets an access token.
function getAccessToken() {
  let bodyString =
    "grant_type=client_credentials&client_id=" +
    "12af7ab6-f961-4da7-8c05-d61a6168bd15" +
    "&client_secret=" +
    "HED?z:i9AL5eCM0X2Xxwf[ZBBCn?9Y4Q" +
    "&resource=" +
    "https://angelsharedemo4.azurehealthcareapis.com";
  let options = {
    method: "POST",
    uri:
      "https://login.microsoftonline.com/79fe009c-79e0-4bc9-baec-a76d3145bde5/oauth2/token/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: bodyString
  };
  return rp(options);
}
//inserts a patient
function getPatients(accessToken) {
  let options = {
    method: "GET",
    baseUrl: "https://angelsharedemo4.azurehealthcareapis.com/",
    url: "Patient",
    headers: {
      Authorization: "Bearer " + accessToken,
      "cache-control": "no-cache",
      "User-Agent": "hackhlth2019-angelshare",
      "Content-Type": "application/json"
    }
  };

  return rp(options);
}
async function main() {
  return getAccessToken()
    .then(data => {
      if (data && typeof data === "string") {
        let newData = JSON.parse(data);
        return getPatients(newData.access_token);
      } else {
        console.log(data);
        return { status: "You have failed this city!!" };
      }
    })
    .then(betterData => {
      console.log(betterData);
      return betterData;
    })
    .catch(err => {
      console.log(err);
      return { status: "You have failed this city!!" };
    });
}
main();
