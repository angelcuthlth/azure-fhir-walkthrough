//kind of uses this
//https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/quickstart-nodejs-text-to-speech

const rp = require("request-promise");

// Gets an access token.
function getAccessToken(subscriptionKey) {
  // let body = JSON.stringify({
  //   //Ocp-Apim-Subscription-Key
  //   grant_type: "client_credentials"
  // });
  // let options = {
  //   method: "POST",
  //   // uri: "https://azurehealthcareapis.com",
  //   uri:
  //     // "https://login.microsoftonline.com/79fe009c-79e0-4bc9-baec-a76d3145bde5",
  //     "https://login.microsoftonline.com/79fe009c-79e0-4bc9-baec-a76d3145bde5/oauth2/token/",
  //   headers: {
  //     "Content-Type": "application/json",
  //     tenant: "79fe009c-79e0-4bc9-baec-a76d3145bde5",
  //     client_id: "12af7ab6-f961-4da7-8c05-d61a6168bd15",
  //     response_type: "code",
  //     client_secret: "HED?z:i9AL5eCM0X2Xxwf[ZBBCn?9Y4Q",
  //     resource: "https://azurehealthcareapis.com",
  //     redirect_uri: "http://localhost:8080",
  //     state: "1234"
  //   },
  //   body: body
  // };
  // return rp(options);
  let url =
    "https://login.microsoftonline.com/79fe009c-79e0-4bc9-baec-a76d3145bde5/oauth2/v2.0/authorize?client_id=12af7ab6-f961-4da7-8c05-d61a6168bd15&response_type=code&redirect_uri=http://localhost&response_mode=query&scope=openid%20offline_access%20https://graph.microsoft.com/mail.read&state=12345";
  let options = {
    method: "POST",
    uri: url
  };
  return rp(options);
}
function insertPatient(accessToken) {
  let fakePatientObj = {
    resourceType: "Patient",
    active: true,
    name: [
      {
        use: "official",
        family: "Kirk",
        given: ["James", "Tiberious"]
      },
      {
        use: "usual",
        given: ["Jim"]
      }
    ],
    gender: "male",
    birthDate: "1960-12-25"
  };
  let options = {
    method: "POST",
    baseUrl: "https://angelsharedemo4.azurehealthcareapis.com/",
    url: "Patient",
    headers: {
      Authorization: "Bearer " + accessToken,
      "cache-control": "no-cache",
      "User-Agent": "hackhlth2019-angelshare",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(fakePatientObj)
  };

  return rp(options);
}
async function main() {
  getAccessToken()
    .then(data => {
      console.log(data);
      return;
    })
    .catch(err => {
      console.log(err);
      return;
    });
  //   const accessToken =
  //     "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImFQY3R3X29kdlJPb0VOZzNWb09sSWgydGlFcyIsImtpZCI6ImFQY3R3X29kdlJPb0VOZzNWb09sSWgydGlFcyJ9.eyJhdWQiOiJodHRwczovL2F6dXJlaGVhbHRoY2FyZWFwaXMuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzlmZTAwOWMtNzllMC00YmM5LWJhZWMtYTc2ZDMxNDViZGU1LyIsImlhdCI6MTU3MjE3NjIwOCwibmJmIjoxNTcyMTc2MjA4LCJleHAiOjE1NzIxODAxMDgsImFjciI6IjEiLCJhaW8iOiJBU1FBMi84TkFBQUErNWYyeFZYSDZ0WWFXYVEyaG4vSXpiZ3hpK2NGNysrY1BydkE0N3BTclNrPSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiIwNGIwNzc5NS04ZGRiLTQ2MWEtYmJlZS0wMmY5ZTFiZjdiNDYiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IjEwNzMzMyIsImdpdmVuX25hbWUiOiJPRExfVXNlciIsImlwYWRkciI6IjEzLjY0LjI0Ni42MiIsIm5hbWUiOiJPRExfVXNlciAxMDczMzMiLCJvaWQiOiI2ZTEwNDc2Yi03NGI4LTQ0NjctODgwOC05YjJiODJmMTNjYTYiLCJwdWlkIjoiMTAwMzIwMDA4MDE1Nzc3NCIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6InV6ZFp5NHVtRzhlSF9wbGdFQjktVE5qdnNRSGd0ZENRczFJTlZQQkRXaXMiLCJ0aWQiOiI3OWZlMDA5Yy03OWUwLTRiYzktYmFlYy1hNzZkMzE0NWJkZTUiLCJ1bmlxdWVfbmFtZSI6Im9kbF91c2VyXzEwNzMzM0Btc2F6dXJlaG9sLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6Im9kbF91c2VyXzEwNzMzM0Btc2F6dXJlaG9sLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6ImFTUjBsX0paMUVhVG9ZU24yeUV1QUEiLCJ2ZXIiOiIxLjAifQ.aEQPi_ZsVca4nUHXF1U_xITzG_VdpMfKVH4x_wFxL58N8uLJXs1xTIb3qlwZYVF-m6-DlOTfmG_3Tr8b_u8NZ9zHAGFCZCk8tKy20KXZFSzpvYcnOY2HIAO8XoKBv2C82Njl_LI5r5wfA41XnrFb5NJxjoheOq9tINUu0a4dyF1ALNc_dnVULHb5ggi4pI8QDN-2B26reTPiipeqxKp_5ouR2fTrl7lni07mvzO-rI0_Ot-h0diORrPVl-dztcun4ZsJXJypyFjBXnGIJW2ngfTj_orJcdvUPPiA_OkAmPiH_6CUw0J3GNOXWQIzgZQEiZI9WDZN7hY1ulm3g69Uyg";
  //   insertPatient(accessToken)
  //     .then(data => {
  //       console.log(data);
  //       return;
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       return;
  //     });
}
main();
