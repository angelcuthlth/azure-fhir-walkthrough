//kind of uses this
//https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/quickstart-nodejs-text-to-speech
//https://docs.microsoft.com/en-us/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow
//https://docs.microsoft.com/en-us/azure/healthcare-apis/access-fhir-postman-tutorial
//https://docs.microsoft.com/en-us/azure/healthcare-apis/get-healthcare-apis-access-token-cli

const rp = require("request-promise");

const fakePatientObj = {
  resourceType: "Patient",
  id: "proband",
  text: {
    status: "generated",
    div:
      '\u003cdiv xmlns\u003d"http://www.w3.org/1999/xhtml"\u003e\n\n      \u003cp\u003e\n\n        \u003cb\u003eAnnie Proband\u003c/b\u003e: Female, born 1966-04-04\n      \u003c/p\u003e\n\n    \u003c/div\u003e'
  },
  identifier: [
    {
      use: "usual",
      type: {
        text: "Computer-Stored Abulatory Records (COSTAR)"
      },
      system: "urn:oid:2.16.840.1.113883.6.117",
      value: "999999999",
      assigner: {
        display: "Boston Massachesetts General Hospital"
      }
    }
  ],
  active: true,
  gender: "female",
  birthDate: "1966-04-04",
  deceasedBoolean: false,
  meta: {
    tag: [
      {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActReason",
        code: "HTEST",
        display: "test health data"
      }
    ]
  }
};
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
function insertPatient(accessToken) {
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
  return getAccessToken()
    .then(data => {
      if (data && typeof data === "string") {
        let newData = JSON.parse(data);
        return insertPatient(newData.access_token);
      } else {
        console.log(data);
        return { status: "You have failed this city!!" };
      }
    })
    .then(betterData => {
      return betterData;
    })
    .catch(err => {
      console.log(err);
      return { status: "You have failed this city!!" };
    });
}
main();
